import Cache from "@bejibun/cache";
import { isNotEmpty } from "@bejibun/utils";
import RateLimiterException from "../exceptions/RateLimiterException";
export default class RateLimiterBuilder {
    key;
    duration; // seconds
    constructor() {
        this.key = "";
        this.duration = 60;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    async attempt(limit, callback) {
        const count = Number(await Cache.increment(this.key, this.duration));
        const canExecute = count <= limit;
        if (isNotEmpty(callback) && typeof callback === "function") {
            if (canExecute)
                return callback();
        }
        else {
            throw new RateLimiterException("Invalid callback.");
        }
        throw new RateLimiterException("Too many attempts.");
    }
}
