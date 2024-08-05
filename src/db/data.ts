import {
  WMSWarehouseMeta,
  SkuBatchData,
  SkuBatchToSkuId,
} from "../interfaces.util";

export const warehouseData: WMSWarehouseMeta[] = [
  { warehouseId: "warehouse-1" },
  { warehouseId: "warehouse-2" },
  { warehouseId: "warehouse-3" },
  { warehouseId: "warehouse-4" },
];

export const appData: SkuBatchToSkuId[] = [
  {
    skuBatchId: "sku-batch-id-1",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1234,
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-2",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1235,
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-3",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1236,
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-4",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1237,
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-5",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1238,
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-6",
    skuId: "sku-id-3",
    quantityPerUnitOfMeasure: 1,
    wmsId: 1239,
    isArchived: false,
    isDeleted: false,
  },
];

export const skuBatchIdsFromInventoryDb = [
  { skuBatchId: "sku-batch-id-1" },
  { skuBatchId: "sku-batch-id-2" },
  { skuBatchId: "sku-batch-id-3" },
  { skuBatchId: "sku-batch-id-4" },
  // { skuBatchId: 'sku-batch-id-5' },
  // { skuBatchId: 'sku-batch-id-6' },
];

export const skuBatchIdsFromAppDb = [
  { id: "sku-batch-id-1" },
  { id: "sku-batch-id-2" },
  { id: "sku-batch-id-3" },
  { id: "sku-batch-id-4" },
  { id: "sku-batch-id-5" },
  { id: "sku-batch-id-6" },
];

export const appSkuBatchData: SkuBatchData[] = [
  {
    skuBatchId: "sku-batch-id-1",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1234",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-2",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1235",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-3",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1236",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-4",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1237",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-5",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1238",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-6",
    skuId: "sku-id-3",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1239",
    isArchived: false,
    isDeleted: false,
  },
];

export const appSkuBatchDataForSkuBatchIds = [
  {
    skuBatchId: "sku-batch-id-1",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1234",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-2",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1235",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-3",
    skuId: "sku-id-1",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1236",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-4",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1237",
    isArchived: false,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-5",
    skuId: "sku-id-2",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1238",
    isArchived: false,
    isDeleted: true,
  },
  {
    skuBatchId: "sku-batch-id-6",
    skuId: "sku-id-3",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1239",
    isArchived: true,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-7",
    skuId: "sku-id-3",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1240",
    isArchived: true,
    isDeleted: false,
  },
  {
    skuBatchId: "sku-batch-id-8",
    skuId: "sku-id-4",
    quantityPerUnitOfMeasure: 1,
    wmsId: "1241",
    isArchived: true,
    isDeleted: false,
  },
];
