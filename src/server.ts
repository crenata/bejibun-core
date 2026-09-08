import type {RouterGroup} from "@/types";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import RuntimeException from "@/exceptions/RuntimeException";
import Router from "@/facades/Router";
import MaintenanceMiddleware from "@/middlewares/MaintenanceMiddleware";
import RateLimiterMiddleware from "@/middlewares/RateLimiterMiddleware";
import RequestMiddleware from "@/middlewares/RequestMiddleware";
import BaseWebSocket from "@/bases/BaseWebSocket";
import WebSocketLoader from "@/loader/WebSocketLoader";

// Boot the application (DB, decorators, websockets, namespaces, CORS)
// before building the server.
await import(App.Path.rootPath("bootstrap.ts"));

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
    private _webSocketIndex?: Map<string, {controller: any; route: any}>;

    /**
     * Loads the application's custom exception handler class from
     * `app/exceptions/handler.ts`.
     *
     * @returns {any} The exception handler class.
     */
    private get exceptionHandler(): any {
        const exceptionHandlerPath = App.Path.appPath("exceptions/handler.ts");

        try {
            return require(exceptionHandlerPath).default;
        } catch (error: any) {
            throw new RuntimeException(
                `Missing exception handler class [${exceptionHandlerPath}].`,
                null,
                error.message
            );
        }
    }

    /**
     * Loads the application's API route definitions from `routes/api.ts`.
     *
     * @returns {any} The API route group.
     */
    private get apiRoutes(): any {
        const apiRoutesPath = App.Path.routesPath("api.ts");

        try {
            return require(apiRoutesPath).default;
        } catch (error: any) {
            throw new RuntimeException(
                `Missing api file on routes directory [${apiRoutesPath}].`,
                null,
                error.message
            );
        }
    }

    /**
     * Loads the application's WebSocket route definitions from `routes/websocket.ts`.
     *
     * @returns {any} The WebSocket route definitions.
     */
    private get webSocketRoutes(): any {
        const webSocketRoutesPath = App.Path.routesPath("websocket.ts");

        try {
            return require(webSocketRoutesPath).default;
        } catch (error: any) {
            throw new RuntimeException(
                `Missing webSocket file on routes directory [${webSocketRoutesPath}].`,
                null,
                error.message
            );
        }
    }

    /**
     * Loads the application's web route definitions from `routes/web.ts`.
     *
     * @returns {RouterGroup} The web route group.
     */
    private get webRoutes(): RouterGroup {
        const webRoutesPath = App.Path.routesPath("web.ts");

        try {
            return require(webRoutesPath).default;
        } catch (error: any) {
            throw new RuntimeException(
                `Missing web file on routes directory [${webRoutesPath}].`,
                null,
                error.message
            );
        }
    }

    /**
     * Resolves the active performance configuration, preferring the
     * application's own `config/performance.ts` over this package's
     * bundled default when present.
     *
     * @returns {Record<string, any>} The performance configuration.
     */
    private get performance(): Record<string, any> {
        let config: any;

        try {
            config = require(App.Path.configPath("performance.ts")).default;
        } catch {
            config = require("@/config/performance").default;
        }

        return config;
    }

    /**
     * Resolves the active OpenAPI/route documentation configuration,
     * preferring the application's own `config/route.ts` over this
     * package's bundled default when present.
     *
     * @returns {Record<string, any>} The route documentation configuration.
     */
    private get route(): Record<string, any> {
        let config: any;

        try {
            config = require(App.Path.configPath("route.ts")).default;
        } catch {
            config = require("@/config/route").default;
        }

        return config;
    }

    /**
     * Resolves the active WebSocket configuration, preferring the
     * application's own `config/websocket.ts` over this package's
     * bundled default when present.
     *
     * @returns {Record<string, any>} The WebSocket configuration.
     */
    private get websocket(): Record<string, any> {
        let config: any;

        try {
            config = require(App.Path.configPath("websocket.ts")).default;
        } catch {
            config = require("@/config/websocket").default;
        }

        return config;
    }

    /**
     * Builds (once) an index mapping each WebSocket route path to its
     * controller class and route definition, so the per-message dispatch
     * is an O(1) lookup instead of two linear scans.
     *
     * @returns {Map<string, {controller: any; route: any}>} The built WebSocket route index.
     */
    private get webSocketIndex(): Map<string, {controller: any; route: any}> {
        if (this._webSocketIndex) return this._webSocketIndex;

        const index = new Map<string, {controller: any; route: any}>();

        for (const controller of WebSocketLoader.controllers) {
            const path = (controller as any).path;

            if (path) index.set(path, {controller, route: index.get(path)?.route});
        }

        const routes: Array<any> = Array.isArray(this.webSocketRoutes)
            ? this.webSocketRoutes
            : this.webSocketRoutes.raws;

        for (const route of routes) {
            const path = (route as any).raw?.path;

            if (!path) continue;

            const existing = index.get(path);
            index.set(path, {controller: existing?.controller, route});
        }

        this._webSocketIndex = index;

        return index;
    }

    /**
     * Builds and starts the Bun server: generates `public/apis.json` from
     * the API routes' `apiDoc` metadata, assembles the conditional
     * middleware stack (rate limiter / maintenance, based on
     * `performance.middlewares`), merges API + web routes behind
     * `RequestMiddleware`, mounts websocket upgrade handlers for every
     * route declared in `routes/websocket.ts`, and starts listening.
     */
    public async run(): Promise<void> {
        const apiRoutes: RouterGroup = Router.serialize(this.apiRoutes);

        const paths: Record<string, any> = {};

        // Build the OpenAPI `paths` object from each raw route's apiDoc metadata.
        for (const item of this.apiRoutes.raws) {
            const raw: Record<string, any> = (item as any).raw;
            const path: string = raw.path.replace(/:([^/]+)/g, "{$1}");

            if (!paths[path]) paths[path] = {};

            paths[path][raw.method.toLowerCase()] = {
                deprecated: raw.apiDoc?.deprecated || false,
                parameters: raw.apiDoc?.request?.params || [],
                summary: raw.apiDoc?.description || "",
                tags: raw.apiDoc?.tags || [],
                responses: raw.apiDoc?.response || {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Success",
                                    status: 200
                                }
                            }
                        }
                    }
                }
            };
        }

        // Persist the generated OpenAPI document, served at /apis.
        await Bun.write(
            App.Path.publicPath("apis.json"),
            JSON.stringify(
                {
                    ...this.route.templates[this.route.default],
                    paths
                },
                null,
                2
            )
        );

        // Global middleware stack, conditionally enabled via performance config.
        const middlewares: Array<any> = [];

        if (this.performance.middlewares.limiter) middlewares.push(new RateLimiterMiddleware());
        if (this.performance.middlewares.maintenance) middlewares.push(new MaintenanceMiddleware());

        const server = Bun.serve({
            development: (Bun.env.APP_ENV || "development") !== "production" && {
                // Enable browser hot reloading in development
                hmr: true,

                // Echo console logs from the browser to the server
                console: true
            },

            error: new this.exceptionHandler().handle,

            port: Bun.env.APP_PORT,

            routes: {
                "/": require(App.Path.publicPath("index.html")),
                "/apis": require(App.Path.publicPath("apis.html")),

                // Merged API + web routes, wrapped in the global middleware
                // stack plus RequestMiddleware (which populates request.payload).
                ...Object.assign(
                    {},
                    Router.serialize(
                        Router.middleware(...middlewares)
                            .middleware(new RequestMiddleware())
                            .group([apiRoutes, Router.serialize(this.webRoutes)])
                    ) || {}
                ),

                // WebSocket upgrade endpoints - one per path declared in
                // routes/websocket.ts, each simply upgrading the connection.
                ...Object.fromEntries(
                    Object.keys(this.webSocketRoutes.routes).map((key: string) => [
                        key,
                        (request: Bun.BunRequest, server: Bun.Server<any>) => {
                            server.upgrade(request, {
                                data: {
                                    id: Bun.randomUUIDv7(),
                                    path: key
                                } as any
                            });
                        }
                    ])
                ),

                // Fallback for any unmatched route.
                "/*": new this.exceptionHandler().publicRoute
            },

            websocket: {
                /** Registers the newly-upgraded client against its route path. */
                open: (ws: Bun.ServerWebSocket<any>): void | Promise<void> => {
                    BaseWebSocket.addClient(ws.data.path, ws);

                    Logger.setContext("WebSocket").info(
                        `Connected from ${ws.data.id} via [${ws.data.path}].`
                    );
                },

                /**
                 * Resolves the WebSocket controller/route registered for
                 * this connection's path and dispatches the incoming
                 * message to its handler method.
                 */
                message: (
                    ws: Bun.ServerWebSocket<any>,
                    message: string | Buffer<ArrayBuffer>
                ): void | Promise<void> => {
                    const entry = this.webSocketIndex.get(ws.data.path);

                    if (!entry?.controller)
                        throw new RuntimeException(
                            `WebSocket controller not found for route [${ws.data.path}].`
                        );

                    if (!entry.route)
                        throw new RuntimeException(`WebSocket route not found [${ws.data.path}].`);

                    const {controller: Controller, route} = entry;
                    const [controllerName, methodName] = route.raw.handler.split("@");

                    const instance: any = new Controller();

                    if (typeof instance[methodName] !== "function") {
                        throw new RuntimeException(
                            `Method "${methodName}" not found in ${controllerName}.`
                        );
                    }

                    Logger.setContext("WebSocket").info(
                        `Received message from ${ws.data.id} via [${ws.data.path}].`
                    );

                    instance[methodName](ws, message);
                },

                /** Deregisters the client on disconnect. */
                close: (
                    ws: Bun.ServerWebSocket<any>,
                    code: number,
                    reason: string
                ): void | Promise<void> => {
                    BaseWebSocket.removeClient(ws.data.path, ws);

                    Logger.setContext("WebSocket").warn(
                        `Disconnected connection from ${ws.data.id} via [${ws.data.path}] [${code}] [${reason}].`
                    );
                },

                // Allow the application's own websocket config to override any of the above.
                ...this.websocket
            }
        });

        Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);
    }
}

await new Server().run();
