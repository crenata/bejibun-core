import type {HandlerType} from "@/types/router";
import App from "@bejibun/app";
import RateLimiter from "@bejibun/limiter";
import LimiterConfig from "@bejibun/limiter/config/limiter";
import {defineValue} from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";

/**
 * Middleware that rate-limits requests per client IP, using `@bejibun/limiter`.
 * Falls back to the package's bundled `LimiterConfig` when the application
 * hasn't provided its own `config/limiter.ts`. Enabled globally via
 * `performance.middlewares.limiter` in `server.ts`.
 */
export default class RateLimiterMiddleware {
    /**
     * Wraps the handler with a per-IP rate limit check, keyed by the
     * requesting client's IP address (converted to a filesystem-safe key
     * via `Str.ipToFileName`).
     *
     * @param handler - The handler to rate-limit.
     * @returns The rate-limited handler.
     */
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bejibun.Request, server: Bun.Server<any>) => {
            const configPath: string = App.Path.configPath("limiter.ts");

            let config: any;

            if (await Bun.file(configPath).exists()) config = require(configPath).default;
            else config = LimiterConfig;

            return await RateLimiter.attempt(
                `rate-limiter/${Str.ipToFileName(defineValue(server.requestIP(request)?.address, ""))}`,
                defineValue(config?.limit, 60),
                () => {
                    return handler(request, server);
                }
            );
        };
    }
}
