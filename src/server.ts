import type {RouterGroup} from "@/types";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";
import fs from "fs";
import PerformanceConfig from "@/config/performance";
import RouteConfig from "@/config/route";
import RuntimeException from "@/exceptions/RuntimeException";
import Router from "@/facades/Router";
import MaintenanceMiddleware from "@/middlewares/MaintenanceMiddleware";
import RateLimiterMiddleware from "@/middlewares/RateLimiterMiddleware";

await import (App.Path.rootPath("bootstrap.ts"));

export default class Server {
    private get exceptionHandler(): any {
        const exceptionHandlerPath = App.Path.appPath("exceptions/handler.ts");

        try {
            return require(exceptionHandlerPath).default;
        } catch (error: any) {
            throw new RuntimeException(`Missing exception handler class [${exceptionHandlerPath}].`, null, error.message);
        }
    }

    private get apiRoutes(): any {
        const apiRoutesPath = App.Path.routesPath("api.ts");

        try {
            return require(apiRoutesPath).default;
        } catch (error: any) {
            throw new RuntimeException(`Missing api file on routes directory [${apiRoutesPath}].`, null, error.message);
        }
    }

    private get webRoutes(): RouterGroup {
        const webRoutesPath = App.Path.routesPath("web.ts");

        try {
            return require(webRoutesPath).default;
        } catch (error: any) {
            throw new RuntimeException(`Missing web file on routes directory [${webRoutesPath}].`, null, error.message);
        }
    }

    private get performance(): Record<string, any> {
        const configPath: string = App.Path.configPath("performance.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = PerformanceConfig;

        return config;
    }

    private get route(): Record<string, any> {
        const configPath: string = App.Path.configPath("route.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = RouteConfig;

        return config;
    }

    public async run(): Promise<void> {
        const apiRoutes: RouterGroup = Router.serialize(this.apiRoutes);

        const paths: Record<string, any> = {};

        for (const item of this.apiRoutes.raws) {
            const raw: Record<string, any> = (item as any).raw;
            const path: string = raw.path.replace(/:([^/]+)/g, "{$1}");
            paths[path] = {};

            paths[path][raw.method.toLowerCase()] = {
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

        const middlewares: Array<any> = [];

        if (this.performance.middlewares.limiter) middlewares.push(new RateLimiterMiddleware());
        if (this.performance.middlewares.maintenance) middlewares.push(new MaintenanceMiddleware());

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

                ...Object.assign({}, ...defineValue(Router.middleware(...middlewares).group([
                    Router.namespace("app/exceptions").any("/*", "Handler@route"),

                    apiRoutes,

                    Router.serialize(this.webRoutes)
                ]), []))
            }
        });

        Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);
    }
}

await new Server().run();