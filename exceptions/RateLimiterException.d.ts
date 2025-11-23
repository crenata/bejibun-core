export default class RateLimiterException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
