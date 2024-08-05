import {
  inventoryUpdate,
  RecordWithWMS,
  SkuBatchData,
  SkuBatchToSkuId,
  skuBatchUpdate,
  WMSWarehouseMeta,
} from "./interfaces.util";
import {
  appData,
  appSkuBatchData,
  appSkuBatchDataForSkuBatchIds,
  skuBatchIdsFromAppDb,
  skuBatchIdsFromInventoryDb,
  warehouseData,
} from "./db/data";
import { InventoryService, RESTInventoryService } from "./service/inventory";
import { HttpClient, NoOpHttpClient } from "./http/client";

const logger = console;

/**
 * Create a list of records for a skuBatch record that maps skuBatchId + warehouseId
 * @param skuBatchRecord
 */
const makeWarehouseRecordsForSkuBatchRecord = (
  skuBatchRecord: SkuBatchToSkuId,
): RecordWithWMS[] => {
  return warehouseData.map(
    (warehouse: WMSWarehouseMeta): RecordWithWMS => ({
      skuBatchId: skuBatchRecord.skuBatchId,
      skuId: skuBatchRecord.skuId,
      wmsId: skuBatchRecord.wmsId,
      quantityPerUnitOfMeasure: skuBatchRecord.quantityPerUnitOfMeasure ?? 1,
      isArchived: skuBatchRecord.isArchived,
      isDeleted: skuBatchRecord.isDeleted,
      warehouseId: warehouse.warehouseId,
    }),
  );
};

/**
 * Converts a list of skuBatchIds from the app db into an insert to inventory.
 * @param skuBatchIdsToInsert
 * @param inventory
 * @returns the count of records created
 */
export async function skuBatchToInserts(
  skuBatchIdsToInsert: string[],
  inventory: InventoryService,
): Promise<number> {
  const badSkuBatchCounter = { count: 0 };

  // create our inserts
  const inserts = skuBatchIdsToInsert.reduce(
    (arr: RecordWithWMS[], skuBatchId: string): RecordWithWMS[] => {
      const skuBatchRecordFromAppDb: SkuBatchToSkuId | undefined = appData.find(
        // BUG: need to ensure equality here
        (skuBatchToSkuId: SkuBatchToSkuId): boolean =>
          skuBatchToSkuId.skuBatchId === skuBatchId,
      );

      if (!skuBatchRecordFromAppDb) {
        logger.error(
          `no records found in app SkuBatch [skuBatchId=${skuBatchId}}]`,
        );
        badSkuBatchCounter.count += 1;
        return arr;
      }

      arr.push(
        ...makeWarehouseRecordsForSkuBatchRecord(skuBatchRecordFromAppDb),
      );
      return arr;
    },
    [],
  );

  logger.log(
    `creating inserts [count=${inserts.length}, badSkuBatchRecordCount=${badSkuBatchCounter.count}]`,
  );

  return Promise.all(
    inserts.map((i) => inventory.createInventoryRecords(i)),
  ).then(() => inserts.length);
}

/**
 * Diffs the inventory between app SkuBatch and inventory to determine
 * what we need to copy over.
 */
export async function getDeltas(): Promise<string[]> {
  try {
    const inventorySkuBatchIds: Set<string> = new Set<string>(
      skuBatchIdsFromInventoryDb.map(
        (r: { skuBatchId: string }) => r.skuBatchId,
      ),
    );
    return [
      ...new Set<string>(skuBatchIdsFromAppDb.map((r: { id: string }) => r.id)),
    ].filter((x: string) => !inventorySkuBatchIds.has(x)); // BUG: We want records not present, negate
  } catch (err) {
    logger.error("error querying databases for skuBatchIds");
    logger.error(err);
    throw err;
  }
}

/**
 * Finds the deltas between two lists of SkuBatchData
 * @param appSkuBatchData
 * @param inventorySkuBatchData
 */
export const findDeltas = (
  appSkuBatchData: SkuBatchData[],
  inventorySkuBatchData: SkuBatchData[],
): skuBatchUpdate[] => {
  logger.log(
    "finding data changes between inventory and app SkuBatch datasets",
  );

  return appSkuBatchData
    .map((appSbd: SkuBatchData) => {
      const inventoryRecord: SkuBatchData | undefined =
        inventorySkuBatchData.find(
          (r: SkuBatchData): boolean => r.skuBatchId == appSbd.skuBatchId,
        );

      if (!inventoryRecord) {
        // if we cannot find the matching record, we have a problem
        logger.warn(
          `cannot find matching inventory record! [skuBatchId=${appSbd.skuBatchId}]`,
        );
        // instead of throwing an error, return empty update array which will
        // get filtered out at the end of this chain
        return { skuId: "", skuBatchId: "", updates: [] };
      }

      // go through each key and see if it is different, if so, track it
      const updates: inventoryUpdate[] = Object.keys(inventoryRecord)
        .filter((k: string) => !["skuBatchId"].includes(k))
        .reduce(
          (
            recordUpdates: inventoryUpdate[],
            key: string,
          ): inventoryUpdate[] => {
            const inventoryValue =
              inventoryRecord[key as keyof typeof inventoryRecord];
            const appValue = appSbd[key as keyof typeof appSbd];

            if (key == "skuId" && inventoryValue != null) {
              // if the key is skuId and the current value is set, we won't update
              return recordUpdates;
            }

            if (inventoryValue != appValue) {
              recordUpdates.push({ field: key, newValue: appValue });
            }

            return recordUpdates;
          },
          [] as inventoryUpdate[],
        );

      return {
        skuId: inventoryRecord.skuId,
        skuBatchId: inventoryRecord.skuBatchId,
        updates,
      };
    })
    .filter((sbu: skuBatchUpdate) => sbu.updates.length > 0); // BUG: adjust filter to only return sbu with updates
};

/**
 * Finds changes in data between the app SkuBatch+Sku and inventory tables
 * @param inventory
 * @returns The count of records updated
 */
export async function findChangesBetweenDatasets(
  inventory: InventoryService,
): Promise<number> {
  logger.log(
    "finding app SkuBatch data that has changed and <> the inventory data",
  );

  // Accumulator for collecting update promises
  return [appSkuBatchData].reduce(
    async (
      accumPromise: Promise<number>,
      inventorySkuBatchData: SkuBatchData[],
    ) => {
      const accum = await accumPromise; // Wait for previous operations to complete

      const skuBatchIds: string[] = inventorySkuBatchData.map(
        (sbd: SkuBatchData) => sbd.skuBatchId,
      );

      logger.log(
        `querying Logistics.SkuBatch for data [skuBatchIdCount=${skuBatchIds.length}]`,
      );
      // fetch SkuBatch+Sku data from the app database
      const appSkuBatchData: SkuBatchData[] = appSkuBatchDataForSkuBatchIds;

      // if we have a count mismatch, something is wrong, and we should log out a warning
      if (appSkuBatchData.length !== inventorySkuBatchData.length) {
        // implement the logic to log a message with the IDs missing from app
        // data that exist in the inventory data

        // create a set of skuIds from the app data
        const appIds = new Set(appSkuBatchData.map((item) => item.skuBatchId));

        // find skuIds in the inventory data that are not in the set
        const missingIds = inventorySkuBatchData
          .map((item) => item.skuBatchId)
          .filter((id) => !appIds.has(id));

        if (missingIds.length > 0) {
          logger.log(`Missing skuBatchIds from app database ${missingIds}`);
        }
      }

      const deltas: skuBatchUpdate[] = findDeltas(
        appSkuBatchData,
        inventorySkuBatchData,
      );

      const updatePromises: Promise<void>[] = deltas.map((delta) =>
        inventory.updateInventoryRecords(delta),
      );

      await Promise.all(updatePromises); // could make this Promise.allSettled if we want to handle individual update failures

      return accum + deltas.length;
    },
    Promise.resolve(0),
  );
}

/**
 * Updates inventory data from app SkuBatch and Sku
 */
export async function copyMissingInventoryRecordsFromSkuBatch(
  inventory: InventoryService,
): Promise<void | Error> {
  logger.log("copying missing inventory records from app Sku/SkuBatch");

  // find out what skuBatchIds don't exist in inventory
  const skuBatchIdsToInsert: string[] = await getDeltas();
  logger.log(
    `copying new skuBatch records... [skuBatchCount=${skuBatchIdsToInsert.length}]`,
  );
  try {
    await skuBatchToInserts(skuBatchIdsToInsert, inventory);
  } catch (err) {
    logger.error(err);
    throw err;
  }

  logger.log("done updating additive data to inventory from app db");
}

/**
 * Pulls inventory and SkuBatch data and finds changes in SkuBatch data
 * that are not in the inventory data.
 */
export async function updateInventoryDeltasFromSkuBatch(
  inventory: InventoryService,
): Promise<void> {
  logger.log('updating inventory from deltas in "SkuBatch" data');

  try {
    await findChangesBetweenDatasets(inventory);
  } catch (err) {
    logger.error(err);
    throw err;
  }

  logger.log("done updating inventory from deltas from app db");
}

/**
 * Primary entry point to sync SkuBatch data from the app
 * database over to the inventory database
 */
export async function sync(): Promise<void | Error> {
  const http: HttpClient = new NoOpHttpClient(
    "https://local-inventory.nabis.dev/v1",
  );
  const inventory: InventoryService = new RESTInventoryService(http);
  try {
    await copyMissingInventoryRecordsFromSkuBatch(inventory);
    await updateInventoryDeltasFromSkuBatch(inventory);
  } catch (err) {
    logger.error("error syncing skuBatch data");
    return Promise.reject(err);
  }
}

sync();
