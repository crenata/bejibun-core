/**
 * Composes and starts the application's Bun HTTP/WebSocket server.
 *
 * Responsible for: loading the application's route files (`api.ts`,
 * `web.ts`, `websocket.ts`) and config (`performance.ts`, `route.ts`,
 * `websocket.ts`), generating an OpenAPI spec (`apis.json`) from route
 * `apiDoc` metadata, assembling the global middleware stack, and wiring
 * everything into a single `Bun.serve()` call - including the WebSocket
 * lifecycle handlers (`open`, `message`, `close`) that dispatch incoming
 * messages to the correct WebSocket controller method.
 */
export default class Server {
    /** Index of WebSocket route path -> controller/route, built once at startup for O(1) message dispatch. */
    private _webSocketIndex?;
    /**
     * Loads the application's custom exception handler class from
     * `app/exceptions/handler.ts`.
     *
     * @returns {any} The exception handler class.
     */
    private get exceptionHandler();
    /**
     * Loads the application's API route definitions from `routes/api.ts`.
     *
     * @returns {any} The API route group.
     */
    private get apiRoutes();
    /**
     * Loads the application's WebSocket route definitions from `routes/websocket.ts`.
     *
     * @returns {any} The WebSocket route definitions.
     */
    private get webSocketRoutes();
    /**
     * Loads the application's web route definitions from `routes/web.ts`.
     *
     * @returns {RouterGroup} The web route group.
     */
    private get webRoutes();
    /**
     * Resolves the active performance configuration, preferring the
     * application's own `config/performance.ts` over this package's
     * bundled default when present.
     *
     * @returns {Record<string, any>} The performance configuration.
     */
    private get performance();
    /**
     * Resolves the active OpenAPI/route documentation configuration,
     * preferring the application's own `config/route.ts` over this
     * package's bundled default when present.
     *
     * @returns {Record<string, any>} The route documentation configuration.
     */
    private get route();
    /**
     * Resolves the active WebSocket configuration, preferring the
     * application's own `config/websocket.ts` over this package's
     * bundled default when present.
     *
     * @returns {Record<string, any>} The WebSocket configuration.
     */
    private get websocket();
    /**
     * Builds (once) an index mapping each WebSocket route path to its
     * controller class and route definition, so the per-message dispatch
     * is an O(1) lookup instead of two linear scans.
     *
     * @returns {Map<string, {controller: any; route: any}>} The built WebSocket route index.
     */
    private get webSocketIndex();
    /**
     * Builds and starts the Bun server: generates `public/apis.json` from
     * the API routes' `apiDoc` metadata, assembles the conditional
     * middleware stack (rate limiter / maintenance, based on
     * `performance.middlewares`), merges API + web routes behind
     * `RequestMiddleware`, mounts websocket upgrade handlers for every
     * route declared in `routes/websocket.ts`, and starts listening.
     */
    run(): Promise<void>;
}
