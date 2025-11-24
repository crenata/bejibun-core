export default class RateLimiter {
    static attempt(key: string, limit: number, callback: Function, duration?: number): Promise<any>;
    static tooManyAttempts(key: string, limit: number, duration?: number): Promise<boolean>;
    static clear(key: string): Promise<void>;
}
