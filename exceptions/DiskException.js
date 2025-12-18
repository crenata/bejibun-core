import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
export default class DiskException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "DiskException";
        this.code = defineValue(code, 503);
        Logger.setContext(this.name).error(this.message).trace(this.stack);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DiskException);
        }
    }
}
