import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
import RuntimeException from "./exceptions/RuntimeException";
import Router from "./facades/Router";
import MaintenanceMiddleware from "./middlewares/MaintenanceMiddleware";
import RateLimiterMiddleware from "./middlewares/RateLimiterMiddleware";
import(App.Path.rootPath("bootstrap.ts"));
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
    get webRoutes() {
        const webRoutesPath = App.Path.routesPath("web.ts");
        try {
            return require(webRoutesPath).default;
        }
        catch (error) {
            throw new RuntimeException(`Missing web file on routes directory [${webRoutesPath}].`, null, error.message);
        }
    }
    run() {
        const server = Bun.serve({
            development: Bun.env.NODE_ENV !== "production" && {
                // Enable browser hot reloading in development
                hmr: true,
                // Echo console logs from the browser to the server
                console: true
            },
            error: new this.exceptionHandler().handle,
            port: Bun.env.APP_PORT,
            routes: {
                "/": require(App.Path.publicPath("index.html")),
                ...Object.assign({}, ...defineValue(Router.middleware(new MaintenanceMiddleware(), new RateLimiterMiddleware()).group([
                    Router.namespace("app/exceptions").any("/*", "Handler@route"),
                    Router.serialize(this.apiRoutes),
                    Router.serialize(this.webRoutes)
                ]), []))
            }
        });
        Logger.setContext("APP").info(`🚀 Server running at ${server.url.origin}`);
    }
}
new Server().run();
