export default class RateLimiterBuilder {
    protected key: string;
    protected duration: number;
    constructor();
    setKey(key: string): RateLimiterBuilder;
    setDuration(duration: number): RateLimiterBuilder;
    attempt(limit: number, callback: Function): Promise<any>;
}
