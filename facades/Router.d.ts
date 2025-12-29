import type { ResourceOptions } from "../builders/RouterBuilder";
import type { IMiddleware } from "../types/middleware";
import type { HandlerType, RouterGroup } from "../types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import RouterBuilder from "../builders/RouterBuilder";
import { Route } from "../types/router";
export default class Router {
    static prefix(basePath: string): RouterBuilder;
    static middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    static namespace(baseNamespace: string): RouterBuilder;
    static x402(): RouterBuilder;
    static resources(controller: Record<string, HandlerType>, options?: ResourceOptions): RouterGroup;
    static group(routes: Route | Array<Route> | RouterGroup): RouterGroup | Array<RouterGroup>;
    static connect(path: string, handler: string | HandlerType): Route;
    static delete(path: string, handler: string | HandlerType): Route;
    static get(path: string, handler: string | HandlerType): Route;
    static head(path: string, handler: string | HandlerType): Route;
    static options(path: string, handler: string | HandlerType): Route;
    static patch(path: string, handler: string | HandlerType): Route;
    static post(path: string, handler: string | HandlerType): Route;
    static put(path: string, handler: string | HandlerType): Route;
    static trace(path: string, handler: string | HandlerType): Route;
    static match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup;
    static any(path: string, handler: string | HandlerType): RouterGroup;
    static serialize(routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>): RouterGroup | Array<RouterGroup>;
}
