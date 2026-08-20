import App from "@bejibun/app";
import RateLimiter from "@bejibun/limiter";
import LimiterConfig from "@bejibun/limiter/config/limiter";
import { defineValue } from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
export default class RateLimiterMiddleware {
    handle(handler) {
        return async (request, server) => {
            const configPath = App.Path.configPath("limiter.ts");
            let config;
            if (await Bun.file(configPath).exists())
                config = require(configPath).default;
            else
                config = LimiterConfig;
            return await RateLimiter.attempt(`rate-limiter/${Str.ipToFileName(defineValue(server.requestIP(request)?.address, ""))}`, defineValue(config?.limit, 60), () => {
                return handler(request, server);
            });
        };
    }
}
