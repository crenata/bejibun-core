import type {IMiddleware} from "@/types/middleware";
import type {HandlerType, RouterGroup} from "@/types/router";
import RouterBuilder, {ResourceOptions} from "@/builders/RouterBuilder";
import HttpMethodEnum from "@/enums/HttpMethodEnum";
import Enum from "@/facades/Enum";
import {isEmpty} from "@/utils/utils";

export default class Router {
    public static prefix(basePath: string): RouterBuilder {
        return new RouterBuilder().prefix(basePath);
    }

    public static middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        return new RouterBuilder().middleware(...middlewares);
    }

    public static resources(
        controller: Record<string, HandlerType>,
        options?: ResourceOptions
    ): RouterGroup {
        return new RouterBuilder().resources(controller, options);
    }

    public static group(routes: RouterGroup, prefix?: string, middlewares?: Array<IMiddleware>) {
        const builder = new RouterBuilder();

        if (prefix) builder.prefix(prefix);
        if (middlewares?.length) builder.middleware(...middlewares);

        return builder.group(routes);
    }

    public static connect(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Connect, path, handler);
    }

    public static delete(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Delete, path, handler);
    }

    public static get(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Get, path, handler);
    }

    public static head(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Head, path, handler);
    }

    public static options(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Options, path, handler);
    }

    public static patch(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Patch, path, handler);
    }

    public static post(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Post, path, handler);
    }

    public static put(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Put, path, handler);
    }

    public static trace(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Trace, path, handler);
    }

    public static match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup {
        const builder = new RouterBuilder();
        const routeMap: RouterGroup = {};

        for (const method of methods) {
            const single = builder.buildSingle(method, path, handler);
            const fullPath = Object.keys(single)[0];
            const handlers = single[fullPath];

            if (isEmpty(routeMap[fullPath])) routeMap[fullPath] = {};

            Object.assign(routeMap[fullPath], handlers);
        }

        return routeMap;
    }

    public static any(path: string, handler: string | HandlerType): RouterGroup {
        return this.match(Enum.setEnums(HttpMethodEnum).toArray(), path, handler);
    }
}