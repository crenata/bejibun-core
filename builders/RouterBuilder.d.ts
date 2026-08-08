import type { TFacilitator, TRoutePayment } from "@bejibun/x402/types";
import type { ApiDocConfig } from "../decorators/ApiDocDecorator";
import type { IMiddleware } from "../types/middleware";
import type { HandlerType, RawsRoute, ResourceAction, Route, RouterGroup } from "../types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import "reflect-metadata";
import BaseController from "../bases/BaseController";
export interface ResourceOptions {
    only?: Array<ResourceAction>;
    except?: Array<ResourceAction>;
}
export default class RouterBuilder {
    protected basePath: string;
    protected middlewares: Array<IMiddleware>;
    protected baseNamespace: string;
    protected apiDoc: ApiDocConfig;
    prefix(basePath: string): RouterBuilder;
    middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    namespace(baseNamespace: string): RouterBuilder;
    x402(facilitator?: TFacilitator, routePayment?: TRoutePayment): RouterBuilder;
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
    websocket(path: string, handler: string | HandlerType): Route;
    serialize(routes: Route | Array<Route> | RouterGroup | Array<RouterGroup> | Array<RawsRoute>): RouterGroup;
    private mergeRoutes;
    private joinPaths;
    private resolveControllerString;
    private resolveIncludedActions;
    private hasRaw;
    private hasRaws;
    private isMethodMap;
    private applyGroup;
}
