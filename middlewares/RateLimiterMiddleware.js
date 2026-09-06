import App from "@bejibun/app";
import RateLimiter from "@bejibun/limiter";
import Str from "@bejibun/utils/facades/Str";
/** The rate limiter config, resolved once and reused per request. */
let cachedConfig;
/**
 * Resolves the rate limiter config once: prefers the app's own
 * `config/limiter.ts` if it exists, otherwise falls back to the bundled
 * default.
 *
 * @returns {any} The resolved limiter config.
 */
const loadConfig = () => {
    if (cachedConfig)
        return cachedConfig;
    try {
        cachedConfig = require(App.Path.configPath("limiter.ts")).default;
    }
    catch {
        cachedConfig = require("@bejibun/limiter/config/limiter").default;
    }
    return cachedConfig;
};
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
     * @param {HandlerType} handler - The handler to rate-limit.
     * @returns {HandlerType} The rate-limited handler.
     */
    handle(handler) {
        return async (request, server) => {
            const config = loadConfig();
            return await RateLimiter.attempt(`rate-limiter/${Str.ipToFileName(server.requestIP(request)?.address ?? "")}`, config?.limit ?? 60, () => {
                return handler(request, server);
            });
        };
    }
}
