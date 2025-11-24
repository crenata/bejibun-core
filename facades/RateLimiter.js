import { defineValue } from "@bejibun/utils";
import RateLimiterBuilder from "../builders/RateLimiterBuilder";
export default class RateLimiter {
    static async attempt(key, limit, callback, duration) {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setLimit(defineValue(limit, 60))
            .setDuration(defineValue(duration, 60))
            .attempt(callback);
    }
    static async tooManyAttempts(key, limit, duration) {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setLimit(defineValue(limit, 60))
            .setDuration(defineValue(duration, 60))
            .tooManyAttempts();
    }
    static async clear(key) {
        return await new RateLimiterBuilder()
            .setKey(key)
            .clear();
    }
}
