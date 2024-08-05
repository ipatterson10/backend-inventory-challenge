# Nabis Coding Exercises

## Requirements

- Node v20

## Setup

```shell
npm install
```

## Running tests

```shell
npm test
```

## Project Details

This is a NodeJS project that comes from one of our production services that is responsible
for synchronizing data between two different Postgres databases. This service is responsible for finding
deltas between the `app` database and the `inventory` database then creating proper representations in
the `inventory` database.

A better description may be the following case:

A new product is created in the `app` database. Our service will find that new product and create a
corresponding record for that new product in the `inventory` database.

This project requires no database connection. The data calls are mocked with simple JSON
that is defined in `./src/db/data.ts`.

The entrypoint is at the very bottom of `sync.ts`, the function is named `sync`.

## Schema

- `inventory` inventory data schema
  - `inventory` - inventory data at the SkuBatch + Warehouse-level
  - `inventory_aggregate` - inventory data at the SkuBatch-level
- `app` web app schema
  - `Sku` - a unique product
  - `Batch` - a batch of harvest material
  - `SkuBatch` - a Sku that is created from a specific batch

## Term Glossary

- `Sku` a SKU is a unique product - think a **1.0 gram Maui Wowie vape cartridge**
- `Batch` a SKU is created by different harvest material, a SKU is crafted from multiple batches
- `SkuBatch` a SkuBatch is a SKU that is created from a specific batch - it is the unique tuple that represents a distinct Sku created from a distinct Batch.
- `WMS` Warehouse Management System - the system that manages inventory in the warehouse

# Tasks

1. Find the bugs in the codebase and fix them
2. Implement the requested functional in `./src/db/sql.util.ts` in `formatSqlValue`
3. Implement the functional as requested in the comment on line 176 of `sync.ts`
4. Complete the commented out tests in `sync.spec.ts`
5. Envision us now not making the inserts and updates directly to the `inventory` database. Implement the ability to make the necessary POST/PUT request to an API endpoint to create/update the inventory records (instead of making updates directly).
   - The fake API endpoint should be `https://local-inventory.nabis.dev/v1/`
   - The `/inventory` endpoint accepts POST and PUT. The `skuBatchId`, `skuId`, and `warehouseId` fields are required.
   - The `/inventory-aggregate` endpoint accepts POST and PUT. The `skuBatchId` and `skuId` fields are required.
   - The body of the request payload should be JSON with the required keys/values.
