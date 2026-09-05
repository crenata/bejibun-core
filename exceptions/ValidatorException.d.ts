/**
 * Thrown when Vine validation fails (via `BaseController.validate()` or
 * `Bejibun.Request.validate()`). Defaults to HTTP status `422`. Logs
 * itself (message + stack trace) on construction, and is recognized by
 * `ExceptionHandler` to produce a matching JSON error response.
 */
export default class ValidatorException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    code: number;
    /**
     * @param {string} message - The error message (typically the first Vine validation failure's message).
     * @param {number} code - The HTTP status code to respond with. Defaults to `422`.
     * @returns {ValidatorException} A new ValidatorException instance.
     */
    constructor(message?: string, code?: number);
}
