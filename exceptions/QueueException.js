import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
export default class QueueException extends Error {
    code;
    constructor(message, code, stack) {
        super(message);
        this.name = "QueueException";
        this.code = defineValue(code, 500);
        this.stack = stack;
        Logger.setContext(this.name).error(this.message).trace(this.stack);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, QueueException);
        }
    }
}
