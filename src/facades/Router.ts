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
    /**
     * Starts a new builder with the given base path prefix.
     *
     * @param {string} basePath - The path prefix (e.g. `/api/v1`).
     * @returns {RouterBuilder} A new builder with the prefix applied.
     */
    public static prefix(basePath: string): RouterBuilder {
        return new RouterBuilder().prefix(basePath);
    }

    /**
     * Starts a new builder with the given middleware stack.
     *
     * @param {Array<IMiddleware>} middlewares - The middleware instances to add.
     * @returns {RouterBuilder} A new builder with the middleware applied.
     */
    public static middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        return new RouterBuilder().middleware(...middlewares);
    }

    /**
     * Starts a new builder with the given controller namespace.
     *
     * @param {string} baseNamespace - The namespace/directory controllers are resolved from.
     * @returns {RouterBuilder} A new builder with the namespace applied.
     */
    public static namespace(baseNamespace: string): RouterBuilder {
        return new RouterBuilder().namespace(baseNamespace);
    }

    /**
     * Starts a new builder with x402 payment-gated middleware attached.
     *
     * @param {TFacilitator} facilitator - Optional payment facilitator configuration.
     * @param {TRoutePayment} routePayment - Optional per-route payment requirements.
     * @returns {RouterBuilder} A new builder with the x402 middleware applied.
     */
    public static x402(facilitator?: TFacilitator, routePayment?: TRoutePayment): RouterBuilder {
        return new RouterBuilder().x402(facilitator, routePayment);
    }

    /**
     * Registers RESTful CRUD routes for a controller.
     *
     * @param {string} path - The base resource path (e.g. `/users`).
     * @param {typeof BaseController} controller - The controller class providing the resource actions.
     * @param {ResourceOptions} options - Optional `only`/`except` action filters.
     * @returns {RouterGroup} The resulting route group.
     */
    public static resource(
        path: string,
        controller: typeof BaseController,
        options?: ResourceOptions
    ): RouterGroup {
        return new RouterBuilder().resource(path, controller, options);
    }

    /**
     * Groups one or more routes/route groups together.
     *
     * @param {Route | Array<Route> | RouterGroup} routes - The route(s) or group(s) to combine.
     * @returns {RouterGroup | Array<RouterGroup>} The merged route group (or an array of groups).
     */
    public static group(
        routes: Route | Array<Route> | RouterGroup
    ): RouterGroup | Array<RouterGroup> {
        return new RouterBuilder().group(routes);
    }

    /**
     * Registers a `CONNECT` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static connect(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().connect(path, handler);
    }

    /**
     * Registers a `DELETE` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static delete(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().delete(path, handler);
    }

    /**
     * Registers a `GET` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static get(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().get(path, handler);
    }

    /**
     * Registers a `HEAD` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static head(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().head(path, handler);
    }

    /**
     * Registers an `OPTIONS` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static options(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().options(path, handler);
    }

    /**
     * Registers a `PATCH` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static patch(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().patch(path, handler);
    }

    /**
     * Registers a `POST` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static post(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().post(path, handler);
    }

    /**
     * Registers a `PUT` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static put(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().put(path, handler);
    }

    /**
     * Registers a `TRACE` route.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {Route} The built route.
     */
    public static trace(path: string, handler: string | HandlerType): Route {
        return new RouterBuilder().trace(path, handler);
    }

    /**
     * Registers the same path/handler for multiple HTTP methods.
     *
     * @param {Array<HttpMethodEnum>} methods - The HTTP methods to register.
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {RouterGroup} The merged route group covering all given methods.
     */
    public static match(
        methods: Array<HttpMethodEnum>,
        path: string,
        handler: string | HandlerType
    ): RouterGroup {
        return new RouterBuilder().match(methods, path, handler);
    }

    /**
     * Registers a route that responds to every HTTP method.
     *
     * @param {string} path - The route path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {RouterGroup} The merged route group covering every HTTP method.
     */
    public static any(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().any(path, handler);
    }

    /**
     * Registers a WebSocket upgrade route.
     *
     * @param {string} path - The websocket path.
     * @param {string | HandlerType} handler - The controller definition (`"Controller@method"`) or handler function.
     * @returns {RouterGroup} The resulting route group.
     */
    public static websocket(path: string, handler: string | HandlerType): RouterGroup {
        return new RouterBuilder().websocket(path, handler);
    }

    /**
     * Flattens routes/route groups into a single serialized route map.
     *
     * @param {Route | Array<Route> | RouterGroup | Array<RouterGroup>} routes - The route(s) or group(s) to flatten.
     * @returns {RouterGroup} The flattened route map.
     */
    public static serialize(
        routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>
    ): RouterGroup {
        return new RouterBuilder().serialize(routes);
    }
}
