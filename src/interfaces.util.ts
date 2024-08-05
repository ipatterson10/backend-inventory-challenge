/* istanbul ignore file */
export interface SkuBatchResults {
  id: string;
  wmsId: number;
  skuId: string;
  quantityPerUnitOfMeasure: number;
}

export interface RecordWithoutWMS {
  skuBatchId: string;
  warehouseId: string;
  skuId: string;
  quantityPerUnitOfMeasure: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export interface RecordWithWMS extends RecordWithoutWMS {
  wmsId: number;
}

export interface SkuBatchData {
  skuBatchId: string;
  skuId: string | null;
  wmsId: string | null;
  quantityPerUnitOfMeasure: number;
  isArchived: boolean;
  isDeleted: boolean;
}

export interface inventoryUpdate {
  field: string;
  newValue: string | number | boolean | null;
}

export interface skuBatchUpdate {
  skuBatchId: string;
  skuId: string | null;
  updates: inventoryUpdate[];
}

export interface SkuBatchToSkuId {
  skuBatchId: string;
  skuId: string;
  quantityPerUnitOfMeasure: number;
  wmsId: number;
  isArchived: boolean;
  isDeleted: boolean;
}

export interface WMSWarehouseMeta {
  warehouseId: string;
}
