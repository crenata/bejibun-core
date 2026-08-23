import type { HandlerType } from "../types/router";
/**
 * Middleware that short-circuits every request with the configured
 * maintenance message/status while the application is in maintenance
 * mode (see `App.Maintenance`), instead of letting it reach the handler.
 * Enabled globally via `performance.middlewares.maintenance` in `server.ts`.
 */
export default class MaintenanceMiddleware {
    /**
     * Wraps the handler with a maintenance-mode check.
     *
     * @param handler - The handler to guard.
     * @returns The maintenance-aware handler.
     */
    handle(handler: HandlerType): HandlerType;
}
