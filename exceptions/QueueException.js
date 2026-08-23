import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
/**
 * Thrown for queue-related failures (e.g. missing queue configuration).
 * Defaults to HTTP status `500`. Logs itself (message + stack trace) on
 * construction, and is recognized by `ExceptionHandler` to produce a
 * matching JSON error response.
 */
export default class QueueException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    code;
    /**
     * @param message - The error message.
     * @param code - The HTTP status code to respond with. Defaults to `500`.
     * @param stack - Optional stack trace to use instead of the auto-captured one.
     */
    constructor(message, code, stack) {
        super(message);
        this.name = "QueueException";
        this.code = defineValue(code, 500);
        this.stack = stack;
        Logger.setContext(this.name).error(this.message).trace(this.stack);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, QueueException);
        }
    }
}
