import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

export default class RouterInvalidException extends Error {
    public code: number;

    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "RouterInvalidException";
        this.code = defineValue(code, 500);

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RouterInvalidException);
        }
    }
}