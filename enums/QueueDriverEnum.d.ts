/**
 * Supported queue connection drivers.
 */
declare enum QueueDriverEnum {
    /** Database-backed queue, persisting jobs via `JobModel`. */
    Database = "database"
}
export default QueueDriverEnum;
