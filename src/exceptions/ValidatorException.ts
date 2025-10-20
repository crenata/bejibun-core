import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

export default class ValidatorException extends Error {
    public code: number;

    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "ValidatorException";
        this.code = defineValue(code, 422);

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidatorException);
        }
    }
}