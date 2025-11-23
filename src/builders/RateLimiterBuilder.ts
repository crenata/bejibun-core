import Cache from "@bejibun/cache";
import {isNotEmpty} from "@bejibun/utils";
import RateLimiterException from "@/exceptions/RateLimiterException";

export default class RateLimiterBuilder {
    protected key: string;
    protected duration: number; // seconds

    public constructor() {
        this.key = "";
        this.duration = 60;
    }

    public setKey(key: string): RateLimiterBuilder {
        this.key = key;

        return this;
    }

    public setDuration(duration: number): RateLimiterBuilder {
        this.duration = duration;

        return this;
    }

    public async attempt(limit: number, callback: Function): Promise<any> {
        const count = Number(await Cache.increment(this.key, this.duration));

        const canExecute = count <= limit;

        if (isNotEmpty(callback) && typeof callback === "function") {
            if (canExecute) return callback();
        } else {
            throw new RateLimiterException("Invalid callback.");
        }

        throw new RateLimiterException("Too many attempts.");
    }
}