import Logger from "@bejibun/logger";

/**
 * Thrown for routing-related failures (e.g. malformed controller
 * definitions, unresolved controllers/methods, missing optional
 * packages like `@bejibun/x402`). Defaults to HTTP status `500`. Logs
 * itself (message + stack trace) on construction, and is recognized by
 * `ExceptionHandler` to produce a matching JSON error response.
 */
export default class RouterException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    public code: number;

    /**
     * @param {string} message - The error message.
     * @param {number} code - The HTTP status code to respond with. Defaults to `500`.
     * @returns {RouterException} A new RouterException instance.
     */
    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "RouterException";
        this.code = code ?? 500;

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RouterException);
        }
    }
}
