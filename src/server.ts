import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import RuntimeException from "@/exceptions/RuntimeException";
import Router from "@/facades/Router";
import {RouterGroup} from "@/types";
import MaintenanceMiddleware from "@/middlewares/MaintenanceMiddleware";
import RateLimiterMiddleware from "@/middlewares/RateLimiterMiddleware";
import (App.Path.rootPath("bootstrap.ts"));

const exceptionHandlerPath = App.Path.appPath("exceptions/handler.ts");
let ExceptionHandler: any;
try {
    ExceptionHandler = require(exceptionHandlerPath).default;
} catch (error: any) {
    throw new RuntimeException(`Missing exception handler class [${exceptionHandlerPath}].`, null, error.message);
}

const apiRoutesPath = App.Path.routesPath("api.ts");
let ApiRoutes: RouterGroup;
try {
    ApiRoutes = require(apiRoutesPath).default;
} catch (error: any) {
    throw new RuntimeException(`Missing api file on routes directory [${apiRoutesPath}].`, null, error.message);
}

const webRoutesPath = App.Path.routesPath("web.ts");
let WebRoutes: RouterGroup;
try {
    WebRoutes = require(webRoutesPath).default;
} catch (error: any) {
    throw new RuntimeException(`Missing web file on routes directory [${webRoutesPath}].`, null, error.message);
}

const server = Bun.serve({
    development: Bun.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true
    },

    error: new ExceptionHandler().handle,

    port: Bun.env.APP_PORT,

    routes: {
        "/": require(App.Path.publicPath("index.html")),

        ...Router.middleware(
            new MaintenanceMiddleware(),
            new RateLimiterMiddleware()
        ).group([
            Router.namespace("app/exceptions").any("/*", "Handler@route"),

            ApiRoutes,

            WebRoutes
        ])
    }
});

Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);