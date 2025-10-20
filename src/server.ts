import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import RuntimeException from "@/exceptions/RuntimeException";
import Router from "@/facades/Router";
import "@/bootstrap";

const exceptionHandlerPath = App.appPath("exceptions/handler.ts");
let ExceptionHandler: any;
try {
    ExceptionHandler = require(exceptionHandlerPath).default;
} catch {
    throw new RuntimeException(`Missing exception handler class [${exceptionHandlerPath}].`);
}

const apiRoutesPath = App.routesPath("api.ts");
let ApiRoutes: any;
try {
    ApiRoutes = require(apiRoutesPath).default;
} catch {
    throw new RuntimeException(`Missing api file on routes directory [${apiRoutesPath}].`);
}

const webRoutesPath = App.routesPath("web.ts");
let WebRoutes: any;
try {
    WebRoutes = require(webRoutesPath).default;
} catch {
    throw new RuntimeException(`Missing web file on routes directory [${webRoutesPath}].`);
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
        ...Router.namespace("app/exceptions").any("/*", "Handler@route"),

        "/": require(App.publicPath("index.html")),

        ...ApiRoutes,

        ...WebRoutes
    }
});

Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);