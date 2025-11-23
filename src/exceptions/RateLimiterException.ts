import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

export default class RateLimiterException extends Error {
    public code: number;

    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "RateLimiterException";
        this.code = defineValue(code, 429);

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RateLimiterException);
        }
    }
}