import type {Timestamp, NullableTimestamp} from "@bejibun/core/bases/BaseModel";
import BaseModel from "@bejibun/core/bases/BaseModel";

/**
 * Example model mapping to the `templates` table.
 */
export default class TemplateModel extends BaseModel {
    /** The database table this model maps to. */
    public static tableName: string = "templates";

    /** The primary key column name. */
    public static idColumn: string = "id";

    /** The primary key column value. */
    declare id: bigint;

    /** The template name. */
    declare name: string;

    /** The creation timestamp. */
    declare created_at: Timestamp;

    /** The last-updated timestamp. */
    declare updated_at: Timestamp;

    /** The soft-delete timestamp, or null if not deleted. */
    declare deleted_at: NullableTimestamp;
}
