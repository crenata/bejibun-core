import {defineValue} from "@bejibun/utils";
import RateLimiterBuilder from "@/builders/RateLimiterBuilder";

export default class RateLimiter {
    public static async attempt(key: string, limit: number, callback: Function, duration?: number): Promise<any> {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setDuration(defineValue(duration, 60))
            .attempt(limit, callback);
    }
}