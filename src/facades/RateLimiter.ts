import {defineValue} from "@bejibun/utils";
import RateLimiterBuilder from "@/builders/RateLimiterBuilder";

export default class RateLimiter {
    public static async attempt(key: string, limit: number, callback: Function, duration?: number): Promise<any> {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setLimit(defineValue(limit, 60))
            .setDuration(defineValue(duration, 60))
            .attempt(callback);
    }

    public static async tooManyAttempts(key: string, limit: number, duration?: number): Promise<boolean> {
        return await new RateLimiterBuilder()
            .setKey(key)
            .setLimit(defineValue(limit, 60))
            .setDuration(defineValue(duration, 60))
            .tooManyAttempts();
    }

    public static async clear(key: string): Promise<void> {
        return await new RateLimiterBuilder()
            .setKey(key)
            .clear();
    }
}