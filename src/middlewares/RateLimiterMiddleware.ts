import type {HandlerType} from "@/types/router";
import {defineValue} from "@bejibun/utils";
import RateLimiter from "@/facades/RateLimiter";

export default class RateLimiterMiddleware {
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest, server: Bun.Server<any>) => {
            return await RateLimiter.attempt(`rate-limiter/${defineValue(server.requestIP(request)?.address, "")}`, 10, () => {
                return handler(request, server);
            });
        };
    }
}