import { defineValue } from "@bejibun/utils";
import RateLimiterBuilder from "../builders/RateLimiterBuilder";
export default class RateLimiter {
    static async attempt(key, limit, callback, duration) {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setDuration(defineValue(duration, 60))
            .attempt(limit, callback);
    }
}
