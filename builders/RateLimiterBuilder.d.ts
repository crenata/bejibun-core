export default class RateLimiterBuilder {
    protected key: string;
    protected limit: number;
    protected duration: number;
    constructor();
    setKey(key: string): RateLimiterBuilder;
    setLimit(limit: number): RateLimiterBuilder;
    setDuration(duration: number): RateLimiterBuilder;
    attempt(callback: Function): Promise<any>;
    tooManyAttempts(): Promise<boolean>;
    clear(): Promise<void>;
}
