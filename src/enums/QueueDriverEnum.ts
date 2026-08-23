/**
 * Supported queue connection drivers.
 */
enum QueueDriverEnum {
    /** Database-backed queue, persisting jobs via `JobModel`. */
    Database = "database"
}

export default QueueDriverEnum;
