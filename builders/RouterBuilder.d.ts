import type { TFacilitator, TPaywall, TX402Config } from "@bejibun/x402";
import type { IMiddleware } from "../types/middleware";
import type { HandlerType, ResourceAction, Route, RouterGroup } from "../types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import BaseController from "../bases/BaseController";
export interface ResourceOptions {
    only?: Array<ResourceAction>;
    except?: Array<ResourceAction>;
}
export default class RouterBuilder {
    private basePath;
    private middlewares;
    private baseNamespace;
    prefix(basePath: string): RouterBuilder;
    middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    namespace(baseNamespace: string): RouterBuilder;
    x402(config?: TX402Config, facilitatorConfig?: TFacilitator, paywallConfig?: TPaywall): RouterBuilder;
    group(routes: Route | Array<Route> | RouterGroup): RouterGroup | Array<RouterGroup>;
    resource(path: string, controller: typeof BaseController, options?: ResourceOptions): RouterGroup;
    buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): Route;
    connect(path: string, handler: string | HandlerType): Route;
    delete(path: string, handler: string | HandlerType): Route;
    get(path: string, handler: string | HandlerType): Route;
    head(path: string, handler: string | HandlerType): Route;
    options(path: string, handler: string | HandlerType): Route;
    patch(path: string, handler: string | HandlerType): Route;
    post(path: string, handler: string | HandlerType): Route;
    put(path: string, handler: string | HandlerType): Route;
    trace(path: string, handler: string | HandlerType): Route;
    match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup;
    any(path: string, handler: string | HandlerType): RouterGroup;
    serialize(routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>): RouterGroup;
    private mergeRoutes;
    private joinPaths;
    private resolveControllerString;
    private resolveIncludedActions;
    private hasRaw;
    private isMethodMap;
    private applyGroup;
}
