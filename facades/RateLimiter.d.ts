export default class RateLimiter {
    static attempt(key: string, limit: number, callback: Function, duration?: number): Promise<any>;
}
