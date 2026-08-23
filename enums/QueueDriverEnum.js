/**
 * Supported queue connection drivers.
 */
var QueueDriverEnum;
(function (QueueDriverEnum) {
    /** Database-backed queue, persisting jobs via `JobModel`. */
    QueueDriverEnum["Database"] = "database";
})(QueueDriverEnum || (QueueDriverEnum = {}));
export default QueueDriverEnum;
