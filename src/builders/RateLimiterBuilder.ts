import Cache from "@bejibun/cache";

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

    public attempt(callback: Function): void {
        return Cache.remember();
    }
}