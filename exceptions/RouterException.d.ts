/**
 * Thrown for routing-related failures (e.g. malformed controller
 * definitions, unresolved controllers/methods, missing optional
 * packages like `@bejibun/x402`). Defaults to HTTP status `500`. Logs
 * itself (message + stack trace) on construction, and is recognized by
 * `ExceptionHandler` to produce a matching JSON error response.
 */
export default class RouterException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    code: number;
    /**
     * @param message - The error message.
     * @param code - The HTTP status code to respond with. Defaults to `500`.
     */
    constructor(message?: string, code?: number);
}
