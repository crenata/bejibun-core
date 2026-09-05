import Luxon from "@bejibun/utils/facades/Luxon";
import BaseModel from "@/bases/BaseModel";

/**
 * Mixin that overrides `BaseModel`'s default `$beforeInsert`/`$beforeUpdate`
 * timestamp hooks to stamp `createdColumn`/`updatedColumn` with Unix
 * epoch integers (via `DateTime.toUnixInteger()`). Useful for tables
 * (like the built-in `jobs` table - see `JobModel`) that store timestamps
 * as integer columns.
 *
 * @param {typeof BaseModel} Base - The `BaseModel` subclass to apply epoch timestamps to.
 * @returns {any} A new class extending `Base` with epoch-integer timestamp hooks.
 */
const EpochTimestamps = (Base: typeof BaseModel): any =>
    class extends Base {
        /** Stamps created/updated columns with the current Unix epoch integer before insert, if already set. */
        $beforeInsert(): void {
            const now = Luxon.DateTime.now().toUnixInteger();

            if ((this as any)[(this.constructor as any).createdColumn]) {
                (this as any)[(this.constructor as any).createdColumn] = now;
            }
            if ((this as any)[(this.constructor as any).updatedColumn]) {
                (this as any)[(this.constructor as any).updatedColumn] = now;
            }
        }

        /** Stamps the updated column with the current Unix epoch integer before update, if already set. */
        $beforeUpdate(): void {
            if ((this as any)[(this.constructor as any).updatedColumn]) {
                (this as any)[(this.constructor as any).updatedColumn] =
                    Luxon.DateTime.now().toUnixInteger();
            }
        }
    };

export default EpochTimestamps;
