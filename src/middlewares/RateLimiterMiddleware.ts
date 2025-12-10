import type {HandlerType} from "@/types/router";
import App from "@bejibun/app";
import {defineValue} from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
import LimiterConfig from "@/config/limiter";
import RateLimiter from "@/facades/RateLimiter";

export default class RateLimiterMiddleware {
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest, server: Bun.Server<any>) => {
            const configPath = App.Path.configPath("limiter.ts");

            let config: any;

            if (await Bun.file(configPath).exists()) config = require(configPath).default;
            else config = LimiterConfig;

            return await RateLimiter
                .attempt(
                    `rate-limiter/${Str.ipToFileName(defineValue(server.requestIP(request)?.address, ""))}`,
                    defineValue(config?.limit, 60),
                    () => {
                        return handler(request, server);
                    });
        };
    }
}