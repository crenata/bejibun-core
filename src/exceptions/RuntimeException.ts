import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

export default class RuntimeException extends Error {
    public code: number;

    public constructor(message?: string, code?: number | undefined | null, stack?: string) {
        super(message);
        this.name = "RuntimeException";
        this.code = defineValue(code, 500);
        this.stack = stack;

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeException);
        }
    }
}