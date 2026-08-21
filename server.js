import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import fs from "fs";
import PerformanceConfig from "./config/performance";
import RouteConfig from "./config/route";
import RuntimeException from "./exceptions/RuntimeException";
import Router from "./facades/Router";
import MaintenanceMiddleware from "./middlewares/MaintenanceMiddleware";
import RateLimiterMiddleware from "./middlewares/RateLimiterMiddleware";
import RequestMiddleware from "./middlewares/RequestMiddleware";
import BaseWebSocket from "./bases/BaseWebSocket";
import WebSocketLoader from "./loader/WebSocketLoader";
await import(App.Path.rootPath("bootstrap.ts"));
export default class Server {
    get exceptionHandler() {
        const exceptionHandlerPath = App.Path.appPath("exceptions/handler.ts");
        try {
            return require(exceptionHandlerPath).default;
        }
        catch (error) {
            throw new RuntimeException(`Missing exception handler class [${exceptionHandlerPath}].`, null, error.message);
        }
    }
    get apiRoutes() {
        const apiRoutesPath = App.Path.routesPath("api.ts");
        try {
            return require(apiRoutesPath).default;
        }
        catch (error) {
            throw new RuntimeException(`Missing api file on routes directory [${apiRoutesPath}].`, null, error.message);
        }
    }
    get webSocketRoutes() {
        const webSocketRoutesPath = App.Path.routesPath("websocket.ts");
        try {
            return require(webSocketRoutesPath).default;
        }
        catch (error) {
            throw new RuntimeException(`Missing webSocket file on routes directory [${webSocketRoutesPath}].`, null, error.message);
        }
    }
    get webRoutes() {
        const webRoutesPath = App.Path.routesPath("web.ts");
        try {
            return require(webRoutesPath).default;
        }
        catch (error) {
            throw new RuntimeException(`Missing web file on routes directory [${webRoutesPath}].`, null, error.message);
        }
    }
    get performance() {
        const configPath = App.Path.configPath("performance.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = PerformanceConfig;
        return config;
    }
    get route() {
        const configPath = App.Path.configPath("route.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = RouteConfig;
        return config;
    }
    get websocket() {
        const configPath = App.Path.configPath("websocket.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = RouteConfig;
        return config;
    }
    async run() {
        const apiRoutes = Router.serialize(this.apiRoutes);
        const paths = {};
        for (const item of this.apiRoutes.raws) {
            const raw = item.raw;
            const path = raw.path.replace(/:([^/]+)/g, "{$1}");
            if (isEmpty(paths[path]))
                paths[path] = {};
            paths[path][raw.method.toLowerCase()] = {
                deprecated: defineValue(raw.apiDoc?.deprecated, false),
                parameters: defineValue(raw.apiDoc?.request?.params, []),
                summary: defineValue(raw.apiDoc?.description, ""),
                tags: defineValue(raw.apiDoc?.tags, []),
                responses: defineValue(raw.apiDoc?.response, {
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
                })
            };
        }
        await Bun.write(App.Path.publicPath("apis.json"), JSON.stringify({
            ...this.route.templates[this.route.default],
            paths
        }, null, 2));
        const middlewares = [];
        if (this.performance.middlewares.limiter)
            middlewares.push(new RateLimiterMiddleware());
        if (this.performance.middlewares.maintenance)
            middlewares.push(new MaintenanceMiddleware());
        const server = Bun.serve({
            development: defineValue(Bun.env.APP_ENV, "development") !== "production" && {
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
                ...Object.assign({}, defineValue(Router.serialize(Router.middleware(...middlewares)
                    .middleware(new RequestMiddleware())
                    .group([apiRoutes, Router.serialize(this.webRoutes)])), {})),
                ...Object.fromEntries(Object.keys(this.webSocketRoutes.routes).map((key) => [
                    key,
                    (request, server) => {
                        server.upgrade(request, {
                            data: {
                                id: Bun.randomUUIDv7(),
                                path: key
                            }
                        });
                    }
                ])),
                "/*": new this.exceptionHandler().publicRoute
            },
            websocket: {
                open: (ws) => {
                    BaseWebSocket.addClient(ws.data.path, ws);
                    Logger.setContext("WebSocket").info(`Connected from ${ws.data.id} via [${ws.data.path}].`);
                },
                message: (ws, message) => {
                    const Controller = WebSocketLoader.controllers.find((controller) => controller.path === ws.data.path);
                    if (isEmpty(Controller))
                        throw new RuntimeException(`WebSocket controller not found for route [${ws.data.path}].`);
                    let route;
                    if (Array.isArray(this.webSocketRoutes)) {
                        route = this.webSocketRoutes.find((route) => route.raw.path === ws.data.path);
                    }
                    else {
                        route = this.webSocketRoutes.raws.find((route) => route.raw.path === ws.data.path);
                    }
                    if (isEmpty(route))
                        throw new RuntimeException(`WebSocket route not found [${ws.data.path}].`);
                    const [controllerName, methodName] = route.raw.handler.split("@");
                    const instance = new Controller();
                    if (typeof instance[methodName] !== "function") {
                        throw new RuntimeException(`Method "${methodName}" not found in ${controllerName}.`);
                    }
                    Logger.setContext("WebSocket").info(`Received message from ${ws.data.id} via [${ws.data.path}].`);
                    instance[methodName](ws, message);
                },
                close: (ws, code, reason) => {
                    BaseWebSocket.removeClient(ws.data.path, ws);
                    Logger.setContext("WebSocket").warn(`Disconnected connection from ${ws.data.id} via [${ws.data.path}] [${code}] [${reason}].`);
                },
                ...this.websocket
            }
        });
        Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);
    }
}
await new Server().run();
