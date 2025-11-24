import Cache from "@bejibun/cache";
import { isNotEmpty } from "@bejibun/utils";
import RateLimiterException from "../exceptions/RateLimiterException";
export default class RateLimiterBuilder {
    key;
    limit;
    duration; // seconds
    constructor() {
        this.key = "";
        this.limit = 60;
        this.duration = 60;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    setLimit(limit) {
        this.limit = limit;
        return this;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    async attempt(callback) {
        const count = Number(await Cache.increment(this.key, this.duration));
        const canExecute = count <= this.limit;
        if (isNotEmpty(callback) && typeof callback === "function") {
            if (canExecute)
                return callback();
        }
        else {
            throw new RateLimiterException("Invalid callback.");
        }
        throw new RateLimiterException("Too many attempts.");
    }
    async tooManyAttempts() {
        const count = Number(await Cache.get(this.key));
        return count > this.limit;
    }
    async clear() {
        return await Cache.forget(this.key);
    }
}
