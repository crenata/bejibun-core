import { QueryBuilder } from "objection";
declare const JobModel_base: any;
/**
 * Built-in model backing the queue's `jobs` table. Uses `EpochTimestamps`
 * for integer-based timestamps, opts out of soft-deletes/update-column
 * bookkeeping (jobs are deleted for real once processed, and don't track
 * an `updated_at`), and falls back to Objection's plain `QueryBuilder`
 * rather than the soft-delete-aware one `BaseModel` normally uses.
 */
export default class JobModel extends JobModel_base {
    /** The database table this model maps to. */
    static tableName: string;
    /** The primary key column name. */
    static idColumn: string;
    /** Jobs don't track an updated-at column. */
    static updatedColumn: null;
    /** Jobs are hard-deleted, not soft-deleted. */
    static deletedColumn: null;
    /** Plain Objection query builder - jobs don't need soft-delete-aware querying. */
    static QueryBuilder: typeof QueryBuilder;
    /** No-op: jobs have no `updatedColumn` to stamp. */
    $beforeUpdate(): void;
    id: bigint;
    queue: string;
    payload: string;
    attempts: bigint;
    reserved_at: bigint | null;
    available_at: bigint;
    created_at: bigint;
}
export {};
