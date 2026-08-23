import BaseModel from "../bases/BaseModel";
/**
 * Mixin that overrides `BaseModel`'s default `$beforeInsert`/`$beforeUpdate`
 * timestamp hooks to stamp `createdColumn`/`updatedColumn` with Unix
 * epoch integers (via `DateTime.toUnixInteger()`) instead of full
 * `DateTime`/ISO values. Useful for tables (like the built-in `jobs`
 * table - see `JobModel`) that store timestamps as integer columns.
 *
 * @param Base - The `BaseModel` subclass to apply epoch timestamps to.
 * @returns A new class extending `Base` with epoch-integer timestamp hooks.
 */
declare const EpochTimestamps: (Base: typeof BaseModel) => any;
export default EpochTimestamps;
