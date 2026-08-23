import type { TFacilitator, TRoutePayment } from "@bejibun/x402/types";
import type { IMiddleware } from "../types/middleware";
import type { HandlerType, ResourceOptions, RouterGroup } from "../types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import BaseController from "../bases/BaseController";
import RouterBuilder from "../builders/RouterBuilder";
import { Route } from "../types/router";
/**
 * Static facade over `RouterBuilder`. Every method here creates a fresh
 * `RouterBuilder` instance and immediately forwards to the matching
 * builder method - this is the entry point route files typically use
 * (e.g. `Router.get(...)`, `Router.prefix(...).group([...])`), rather
 * than instantiating `RouterBuilder` directly.
 */
export default class Router {
    /** Starts a new builder with the given base path prefix. See `RouterBuilder.prefix`. */
    static prefix(basePath: string): RouterBuilder;
    /** Starts a new builder with the given middleware stack. See `RouterBuilder.middleware`. */
    static middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    /** Starts a new builder with the given controller namespace. See `RouterBuilder.namespace`. */
    static namespace(baseNamespace: string): RouterBuilder;
    /** Starts a new builder with x402 payment-gated middleware attached. See `RouterBuilder.x402`. */
    static x402(facilitator?: TFacilitator, routePayment?: TRoutePayment): RouterBuilder;
    /** Registers RESTful CRUD routes for a controller. See `RouterBuilder.resource`. */
    static resource(path: string, controller: typeof BaseController, options?: ResourceOptions): RouterGroup;
    /** Groups one or more routes/route groups together. See `RouterBuilder.group`. */
    static group(routes: Route | Array<Route> | RouterGroup): RouterGroup | Array<RouterGroup>;
    /** Registers a `CONNECT` route. See `RouterBuilder.connect`. */
    static connect(path: string, handler: string | HandlerType): Route;
    /** Registers a `DELETE` route. See `RouterBuilder.delete`. */
    static delete(path: string, handler: string | HandlerType): Route;
    /** Registers a `GET` route. See `RouterBuilder.get`. */
    static get(path: string, handler: string | HandlerType): Route;
    /** Registers a `HEAD` route. See `RouterBuilder.head`. */
    static head(path: string, handler: string | HandlerType): Route;
    /** Registers an `OPTIONS` route. See `RouterBuilder.options`. */
    static options(path: string, handler: string | HandlerType): Route;
    /** Registers a `PATCH` route. See `RouterBuilder.patch`. */
    static patch(path: string, handler: string | HandlerType): Route;
    /** Registers a `POST` route. See `RouterBuilder.post`. */
    static post(path: string, handler: string | HandlerType): Route;
    /** Registers a `PUT` route. See `RouterBuilder.put`. */
    static put(path: string, handler: string | HandlerType): Route;
    /** Registers a `TRACE` route. See `RouterBuilder.trace`. */
    static trace(path: string, handler: string | HandlerType): Route;
    /** Registers the same path/handler for multiple HTTP methods. See `RouterBuilder.match`. */
    static match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup;
    /** Registers a route that responds to every HTTP method. See `RouterBuilder.any`. */
    static any(path: string, handler: string | HandlerType): RouterGroup;
    /** Registers a WebSocket upgrade route. See `RouterBuilder.websocket`. */
    static websocket(path: string, handler: string | HandlerType): RouterGroup;
    /** Flattens routes/route groups into a single serialized route map. See `RouterBuilder.serialize`. */
    static serialize(routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>): RouterGroup;
}
