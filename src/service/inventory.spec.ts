import {
  DbInventoryService,
  InventoryService,
  RESTInventoryService,
  SqlClient,
} from "./inventory";
import { skuBatchUpdate } from "../interfaces.util";
import { HttpClient } from "../http/client";

describe("InventoryService", () => {
  let inventory: InventoryService;

  describe("DbInventoryService", () => {
    let sql: jest.Mocked<SqlClient>;

    beforeEach(() => {
      sql = {
        exec: jest.fn(),
      };
      inventory = new DbInventoryService(sql);
    });

    describe(".createInventoryRecords", () => {
      it("should create the appropriate db records", async () => {
        await inventory.createInventoryRecords({
          quantityPerUnitOfMeasure: 0,
          warehouseId: "warehouse-1",
          wmsId: 123,
          skuBatchId: "1",
          skuId: "1",
        });
        expect(sql.exec).toHaveBeenCalledWith([
          "insert into test_table (col_1, col_2) values (1, 1)",
        ]);
        expect(sql.exec).toHaveBeenCalledTimes(1);
      });
    });

    describe(".updateInventoryRecords", () => {
      it("should update the appropriate db records", async () => {
        const delta: skuBatchUpdate = {
          skuBatchId: "1",
          skuId: "2",
          updates: [
            { field: "wmsId", newValue: "2" },
            { field: "skuId", newValue: "3" },
          ],
        };
        await inventory.updateInventoryRecords(delta);
        expect(sql.exec).toHaveBeenCalledWith([
          `update inventory set wms_id = '2', sku_id = '3' where sku_batch_id = '1'`,
          `update inventory_aggregate set wms_id = '2', sku_id = '3' where sku_batch_id = '1'`,
        ]);
        expect(sql.exec).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("RESTInventoryService", () => {
    let http: jest.Mocked<HttpClient>;

    beforeEach(() => {
      http = {
        baseUrl: "https://localhost",
        post: jest.fn(),
        put: jest.fn(),
      };
      inventory = new RESTInventoryService(http);
    });

    it("should create the appropriate inventory records", async () => {
      await inventory.createInventoryRecords({
        quantityPerUnitOfMeasure: 0,
        warehouseId: "warehouse-1",
        wmsId: 123,
        skuBatchId: "1",
        skuId: "1",
      });
      expect(http.post).toHaveBeenCalledWith("/inventory", {
        body: JSON.stringify({
          quantityPerUnitOfMeasure: 0,
          warehouseId: "warehouse-1",
          wmsId: 123,
          skuBatchId: "1",
          skuId: "1",
        }),
      });
      expect(http.post).toHaveBeenCalledTimes(1);
    });

    it("should update the appropriate inventory records", async () => {
      const delta: skuBatchUpdate = {
        skuBatchId: "1",
        skuId: "2",
        updates: [
          { field: "wmsId", newValue: "2" },
          { field: "skuId", newValue: "3" },
        ],
      };
      await inventory.updateInventoryRecords(delta);
      expect(http.put).toHaveBeenCalledWith("/inventory", {
        body: JSON.stringify({ skuId: "3", skuBatchId: "1", wmsId: "2" }),
      });
      expect(http.put).toHaveBeenCalledWith("/inventory-aggregate", {
        body: JSON.stringify({ skuId: "3", skuBatchId: "1", wmsId: "2" }),
      });
      expect(http.put).toHaveBeenCalledTimes(2);
    });
  });
});
