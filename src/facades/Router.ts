import type {ResourceOptions} from "@/builders/RouterBuilder";
import type {IMiddleware} from "@/types/middleware";
import type {HandlerType, RouterGroup} from "@/types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import RouterBuilder from "@/builders/RouterBuilder";
import {Route} from "@/types/router";

export default class Router {
    public static prefix(basePath: string): RouterBuilder {
        return new RouterBuilder().prefix(basePath);
    }

    public static middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        return new RouterBuilder().middleware(...middlewares);
    }

    public static namespace(baseNamespace: string): RouterBuilder {
        return new RouterBuilder().namespace(baseNamespace);
    }

    public static x402(): RouterBuilder {
        return new RouterBuilder().x402();
    }

    public static resources(
        controller: Record<string, HandlerType>,
        options?: ResourceOptions
    ): RouterGroup {
        return new RouterBuilder().resources(controller, options);
    }

    public static group(routes: Route | Array<Route>, prefix?: string, middlewares?: Array<IMiddleware>): RouterGroup | Array<RouterGroup> {
        const builder = new RouterBuilder();

        if (prefix) builder.prefix(prefix);
        if (middlewares?.length) builder.middleware(...middlewares);

        return builder.group(routes);
    }

    public static connect(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().connect(path, handler);
    }

    public static delete(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().delete(path, handler);
    }

    public static get(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().get(path, handler);
    }

    public static head(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().head(path, handler);
    }

    public static options(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().options(path, handler);
    }

    public static patch(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().patch(path, handler);
    }

    public static post(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().post(path, handler);
    }

    public static put(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().put(path, handler);
    }

    public static trace(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().trace(path, handler);
    }

    public static match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().match(methods, path, handler);
    }

    public static any(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().any(path, handler);
    }
}