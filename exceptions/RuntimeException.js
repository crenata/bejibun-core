import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
export default class RuntimeException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "RuntimeException";
        this.code = defineValue(code, 500);
        Logger.setContext(this.name).error(this.message).trace(this.stack);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeException);
        }
    }
}
