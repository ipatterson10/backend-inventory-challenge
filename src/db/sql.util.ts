import { RecordWithWMS } from "../interfaces.util";

export const insertify = (record: RecordWithWMS): string =>
  `insert into test_table (col_1, col_2) values (${record.skuId}, ${record.skuBatchId})`;

export const getUpdateForSkuBatchRecord = (
  table: string,
  updates: string,
  skuBatchId: string,
) => `update ${table} set ${updates} where sku_batch_id = '${skuBatchId}'`;

// no op that would take our db connection and execute the list of sql statements
export const queryExec = (_db: any, _sql: string[]): Promise<void> =>
  Promise.resolve();

/**
 * Given a string value, replace single quote (') with ('') and double quote
 * (") with ("")
 * @param str the string to be escaped
 * @returns
 */
const escapeString = (str: string): string => {
  return str.replace(/(['"])/g, (q) => q.repeat(2));
};

/**
 * Given a parameter, properly format the value to be used in a sql statement
 * @param v value to be formatted
 * @returns the properly formatted string value
 */
export const formatSqlValue = (
  v: string | number | boolean | null | object,
): string => {
  switch (typeof v) {
    case "string":
      // if we have a string value, wrap it in quotes and escape it
      return `'${escapeString(v)}'`;
    case "number":
      // just return the string value of the number
      return v.toString();
    case "boolean":
      return v ? "true" : "false";
    case "object":
      if (v === null) {
        return "null";
      }
      throw new Error(`Unsupported type: object`);

    default:
      throw new Error(`Unsupported type: ${typeof v}`);
  }
};
