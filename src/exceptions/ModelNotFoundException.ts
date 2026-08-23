import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

/**
 * Thrown when a model lookup (e.g. `BaseModel.findOrFail()`) finds no
 * matching row. Defaults to HTTP status `404`. Logs itself (message +
 * stack trace) on construction, and is recognized by `ExceptionHandler`
 * to produce a matching JSON error response.
 */
export default class ModelNotFoundException extends Error {
    /** The HTTP status code this exception maps to when handled. */
    public code: number;

    /**
     * @param message - The error message.
     * @param code - The HTTP status code to respond with. Defaults to `404`.
     */
    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "ModelNotFoundException";
        this.code = defineValue(code, 404);

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ModelNotFoundException);
        }
    }
}
