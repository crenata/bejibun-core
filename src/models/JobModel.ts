import {QueryBuilder} from "objection";
import BaseModel from "@/bases/BaseModel";
import EpochTimestamps from "@/models/EpochTimestamps";

/**
 * Built-in model backing the queue's `jobs` table. Uses `EpochTimestamps`
 * for integer-based timestamps, opts out of soft-deletes/update-column
 * bookkeeping (jobs are deleted for real once processed, and don't track
 * an `updated_at`), and falls back to Objection's plain `QueryBuilder`
 * rather than the soft-delete-aware one `BaseModel` normally uses.
 */
export default class JobModel extends EpochTimestamps(BaseModel) {
    /** The database table this model maps to. */
    public static tableName: string = "jobs";

    /** The primary key column name. */
    public static idColumn: string = "id";

    /** Jobs don't track an updated-at column. */
    public static updatedColumn = null;

    /** Jobs are hard-deleted, not soft-deleted. */
    public static deletedColumn = null;

    /** Plain Objection query builder - jobs don't need soft-delete-aware querying. */
    public static QueryBuilder = QueryBuilder;

    /** No-op: jobs have no `updatedColumn` to stamp. */
    $beforeUpdate(): void {
        // do nothing
    }

    declare id: bigint;
    declare queue: string;
    declare payload: string;
    declare attempts: bigint;
    declare reserved_at: bigint | null;
    declare available_at: bigint;
    declare created_at: bigint;
}
