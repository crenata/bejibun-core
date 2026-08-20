import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

export default class QueueException extends Error {
    public code: number;

    public constructor(message?: string, code?: number | undefined | null, stack?: string) {
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
