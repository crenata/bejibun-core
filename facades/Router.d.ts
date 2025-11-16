import type { IMiddleware } from "../types/middleware";
import type { HandlerType, RouterGroup } from "../types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import RouterBuilder, { ResourceOptions } from "../builders/RouterBuilder";
export default class Router {
    static prefix(basePath: string): RouterBuilder;
    static middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    static namespace(baseNamespace: string): RouterBuilder;
    static x402(): RouterBuilder;
    static resources(controller: Record<string, HandlerType>, options?: ResourceOptions): RouterGroup;
    static group(routes: RouterGroup, prefix?: string, middlewares?: Array<IMiddleware>): RouterGroup;
    static connect(path: string, handler: string | HandlerType): RouterGroup;
    static delete(path: string, handler: string | HandlerType): RouterGroup;
    static get(path: string, handler: string | HandlerType): RouterGroup;
    static head(path: string, handler: string | HandlerType): RouterGroup;
    static options(path: string, handler: string | HandlerType): RouterGroup;
    static patch(path: string, handler: string | HandlerType): RouterGroup;
    static post(path: string, handler: string | HandlerType): RouterGroup;
    static put(path: string, handler: string | HandlerType): RouterGroup;
    static trace(path: string, handler: string | HandlerType): RouterGroup;
    static match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup;
    static any(path: string, handler: string | HandlerType): RouterGroup;
}
