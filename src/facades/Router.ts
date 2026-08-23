import type {TFacilitator, TRoutePayment} from "@bejibun/x402/types";
import type {IMiddleware} from "@/types/middleware";
import type {HandlerType, ResourceOptions, RouterGroup} from "@/types/router";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import BaseController from "@/bases/BaseController";
import RouterBuilder from "@/builders/RouterBuilder";
import {Route} from "@/types/router";

/**
 * Static facade over `RouterBuilder`. Every method here creates a fresh
 * `RouterBuilder` instance and immediately forwards to the matching
 * builder method - this is the entry point route files typically use
 * (e.g. `Router.get(...)`, `Router.prefix(...).group([...])`), rather
 * than instantiating `RouterBuilder` directly.
 */
export default class Router {
    /** Starts a new builder with the given base path prefix. See `RouterBuilder.prefix`. */
    public static prefix(basePath: string): RouterBuilder {
        return new RouterBuilder().prefix(basePath);
    }

    /** Starts a new builder with the given middleware stack. See `RouterBuilder.middleware`. */
    public static middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        return new RouterBuilder().middleware(...middlewares);
    }

    /** Starts a new builder with the given controller namespace. See `RouterBuilder.namespace`. */
    public static namespace(baseNamespace: string): RouterBuilder {
        return new RouterBuilder().namespace(baseNamespace);
    }

    /** Starts a new builder with x402 payment-gated middleware attached. See `RouterBuilder.x402`. */
    public static x402(facilitator?: TFacilitator, routePayment?: TRoutePayment): RouterBuilder {
        return new RouterBuilder().x402(facilitator, routePayment);
    }

    /** Registers RESTful CRUD routes for a controller. See `RouterBuilder.resource`. */
    public static resource(
        path: string,
        controller: typeof BaseController,
        options?: ResourceOptions
    ): RouterGroup {
        return new RouterBuilder().resource(path, controller, options);
    }

    /** Groups one or more routes/route groups together. See `RouterBuilder.group`. */
    public static group(
        routes: Route | Array<Route> | RouterGroup
    ): RouterGroup | Array<RouterGroup> {
        return new RouterBuilder().group(routes);
    }

    /** Registers a `CONNECT` route. See `RouterBuilder.connect`. */
    public static connect(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().connect(path, handler);
    }

    /** Registers a `DELETE` route. See `RouterBuilder.delete`. */
    public static delete(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().delete(path, handler);
    }

    /** Registers a `GET` route. See `RouterBuilder.get`. */
    public static get(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().get(path, handler);
    }

    /** Registers a `HEAD` route. See `RouterBuilder.head`. */
    public static head(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().head(path, handler);
    }

    /** Registers an `OPTIONS` route. See `RouterBuilder.options`. */
    public static options(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().options(path, handler);
    }

    /** Registers a `PATCH` route. See `RouterBuilder.patch`. */
    public static patch(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().patch(path, handler);
    }

    /** Registers a `POST` route. See `RouterBuilder.post`. */
    public static post(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().post(path, handler);
    }

    /** Registers a `PUT` route. See `RouterBuilder.put`. */
    public static put(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().put(path, handler);
    }

    /** Registers a `TRACE` route. See `RouterBuilder.trace`. */
    public static trace(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().trace(path, handler);
    }

    /** Registers the same path/handler for multiple HTTP methods. See `RouterBuilder.match`. */
    public static match(
        methods: Array<HttpMethodEnum>,
        path: string,
        handler: string | HandlerType
    ): RouterGroup {
        return new RouterBuilder().match(methods, path, handler);
    }

    /** Registers a route that responds to every HTTP method. See `RouterBuilder.any`. */
    public static any(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().any(path, handler);
    }

    /** Registers a WebSocket upgrade route. See `RouterBuilder.websocket`. */
    public static websocket(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().websocket(path, handler);
    }

    /** Flattens routes/route groups into a single serialized route map. See `RouterBuilder.serialize`. */
    public static serialize(
        routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>
    ): RouterGroup {
        return new RouterBuilder().serialize(routes);
    }
}
