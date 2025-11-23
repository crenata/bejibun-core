import { defineValue } from "@bejibun/utils";
import RateLimiter from "../facades/RateLimiter";
export default class RateLimiterMiddleware {
    handle(handler) {
        return async (request, server) => {
            return await RateLimiter.attempt(`rate-limiter/${defineValue(server.requestIP(request)?.address, "")}`, 10, () => {
                return handler(request, server);
            });
        };
    }
}
