import Cache from "@bejibun/cache";
import {isNotEmpty} from "@bejibun/utils";
import RateLimiterException from "@/exceptions/RateLimiterException";

export default class RateLimiterBuilder {
    protected key: string;
    protected limit: number;
    protected duration: number; // seconds

    public constructor() {
        this.key = "";
        this.limit = 60;
        this.duration = 60;
    }

    public setKey(key: string): RateLimiterBuilder {
        this.key = key;

        return this;
    }

    public setLimit(limit: number): RateLimiterBuilder {
        this.limit = limit;

        return this;
    }

    public setDuration(duration: number): RateLimiterBuilder {
        this.duration = duration;

        return this;
    }

    public async attempt(callback: Function): Promise<any> {
        const count = Number(await Cache.increment(this.key, this.duration));

        const canExecute = count <= this.limit;

        if (isNotEmpty(callback) && typeof callback === "function") {
            if (canExecute) return callback();
        } else {
            throw new RateLimiterException("Invalid callback.");
        }

        throw new RateLimiterException("Too many attempts.");
    }

    public async tooManyAttempts(): Promise<boolean> {
        const count = Number(await Cache.get(this.key));

        return count > this.limit;
    }

    public async clear(): Promise<void> {
        return await Cache.forget(this.key);
    }
}