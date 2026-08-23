import { isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
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
const EpochTimestamps = (Base) => class extends Base {
    /** Stamps created/updated columns with the current Unix epoch integer before insert, if already set. */
    $beforeInsert() {
        const now = Luxon.DateTime.now().toUnixInteger();
        if (isNotEmpty(this[this.constructor.createdColumn])) {
            this[this.constructor.createdColumn] = now;
        }
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = now;
        }
    }
    /** Stamps the updated column with the current Unix epoch integer before update, if already set. */
    $beforeUpdate() {
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] =
                Luxon.DateTime.now().toUnixInteger();
        }
    }
};
export default EpochTimestamps;
