/**
 * Thrown when a model lookup (e.g. `BaseModel.findOrFail()`) finds no
 * matching row. Defaults to HTTP status `404`. Logs itself (message +
 * stack trace) on construction, and is recognized by `ExceptionHandler`
 * to produce a matching JSON error response.
 */
export default class ModelNotFoundException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    code: number;
    /**
     * @param message - The error message.
     * @param code - The HTTP status code to respond with. Defaults to `404`.
     */
    constructor(message?: string, code?: number);
}
