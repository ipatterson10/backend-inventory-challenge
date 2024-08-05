import {
  inventoryUpdate,
  RecordWithWMS,
  skuBatchUpdate,
} from "src/interfaces.util";
import {
  formatSqlValue,
  getUpdateForSkuBatchRecord,
  insertify,
  queryExec,
} from "../db/sql.util";
import { HttpClient } from "../http/client";
import { snakeCase } from "lodash";

export interface InventoryService {
  createInventoryRecords(insert: RecordWithWMS): Promise<void>;

  updateInventoryRecords(update: skuBatchUpdate): Promise<void>;
}

export interface SqlClient {
  exec(statements: string[]): Promise<void>;
}

/**
 * Builds list of SQL updates - this is a pretty simple function to turn a delta
 * into a SQL update
 * (Moved from sync to avoid circular imports, and no longer necessary there)
 * @param delta
 */
export const makeUpdates = (delta: skuBatchUpdate): string[] => {
  // convert updates to sql and push updates
  const updatesToMake = delta.updates
    .map(
      (ud: inventoryUpdate) =>
        `${snakeCase(ud.field)} = ${formatSqlValue(ud.newValue)}`,
    )
    .join(", "); // BUG: delimit with comma, not semicolon

  return [
    getUpdateForSkuBatchRecord("inventory", updatesToMake, delta.skuBatchId),
    getUpdateForSkuBatchRecord(
      "inventory_aggregate",
      updatesToMake,
      delta.skuBatchId,
    ),
  ];
};

export class DbInventoryService implements InventoryService {
  constructor(
    private readonly client: SqlClient = {
      exec: (statements: string[]) => queryExec({}, statements),
    },
  ) {}

  createInventoryRecords(insert: RecordWithWMS): Promise<void> {
    return this.client.exec([insertify(insert)]);
  }

  updateInventoryRecords(update: skuBatchUpdate): Promise<void> {
    const statements = makeUpdates(update);
    return this.client.exec(statements);
  }
}

export class RESTInventoryService implements InventoryService {
  constructor(private http: HttpClient) {}

  async createInventoryRecords(insert: RecordWithWMS): Promise<void> {
    // simulating the HTTP call here, but in production code likely want to ensure
    // this returns 201 Created
    await this.http.post("/inventory", {
      body: JSON.stringify({
        ...insert,
        skuBatchId: insert.skuBatchId,
        skuId: insert.skuId,
        warehouseId: insert.warehouseId,
      }),
    });
  }

  private createRecord(updates: inventoryUpdate[]): Record<string, any> {
    return updates.reduce(
      (acc, update) => ({ ...acc, [update.field]: update.newValue }),
      {} as Record<string, any>,
    );
  }

  private async updateInventory(update: skuBatchUpdate): Promise<void> {
    await this.http.put("/inventory", {
      body: JSON.stringify({
        skuId: update.skuId,
        skuBatchId: update.skuBatchId,
        ...this.createRecord(update.updates),
      }),
    });
  }

  private async updateInventoryAggregate(
    update: skuBatchUpdate,
  ): Promise<void> {
    await this.http.put("/inventory-aggregate", {
      body: JSON.stringify({
        skuId: update.skuId,
        skuBatchId: update.skuBatchId,
        ...this.createRecord(update.updates),
      }),
    });
  }

  async updateInventoryRecords(update: skuBatchUpdate): Promise<void> {
    await Promise.all([
      this.updateInventory(update),
      this.updateInventoryAggregate(update),
    ]);
  }
}
