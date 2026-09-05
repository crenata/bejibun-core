import Logger from "@bejibun/logger";

/**
 * General-purpose exception for unexpected runtime failures that don't
 * fit a more specific exception type (e.g. unregistered namespaces,
 * unresolved job/websocket classes). Defaults to HTTP status `500`.
 * Logs itself (message + stack trace) on construction, and is
 * recognized by `ExceptionHandler` to produce a matching JSON error
 * response.
 */
export default class RuntimeException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    public code: number;

    /**
     * @param {string} message - The error message.
     * @param {number} code - The HTTP status code to respond with. Defaults to `500`.
     * @param {string} [stack] - Optional stack trace to override the auto-captured one.
     * @returns {RuntimeException} A new RuntimeException instance.
     */
    public constructor(message?: string, code?: number | undefined | null, stack?: string) {
        super(message);
        this.name = "RuntimeException";
        this.code = code ?? 500;
        this.stack = stack;

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeException);
        }
    }
}
