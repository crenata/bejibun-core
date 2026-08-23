import RouterBuilder from "../builders/RouterBuilder";
/**
 * Static facade over `RouterBuilder`. Every method here creates a fresh
 * `RouterBuilder` instance and immediately forwards to the matching
 * builder method - this is the entry point route files typically use
 * (e.g. `Router.get(...)`, `Router.prefix(...).group([...])`), rather
 * than instantiating `RouterBuilder` directly.
 */
export default class Router {
    /** Starts a new builder with the given base path prefix. See `RouterBuilder.prefix`. */
    static prefix(basePath) {
        return new RouterBuilder().prefix(basePath);
    }
    /** Starts a new builder with the given middleware stack. See `RouterBuilder.middleware`. */
    static middleware(...middlewares) {
        return new RouterBuilder().middleware(...middlewares);
    }
    /** Starts a new builder with the given controller namespace. See `RouterBuilder.namespace`. */
    static namespace(baseNamespace) {
        return new RouterBuilder().namespace(baseNamespace);
    }
    /** Starts a new builder with x402 payment-gated middleware attached. See `RouterBuilder.x402`. */
    static x402(facilitator, routePayment) {
        return new RouterBuilder().x402(facilitator, routePayment);
    }
    /** Registers RESTful CRUD routes for a controller. See `RouterBuilder.resource`. */
    static resource(path, controller, options) {
        return new RouterBuilder().resource(path, controller, options);
    }
    /** Groups one or more routes/route groups together. See `RouterBuilder.group`. */
    static group(routes) {
        return new RouterBuilder().group(routes);
    }
    /** Registers a `CONNECT` route. See `RouterBuilder.connect`. */
    static connect(path, handler) {
        return new RouterBuilder().connect(path, handler);
    }
    /** Registers a `DELETE` route. See `RouterBuilder.delete`. */
    static delete(path, handler) {
        return new RouterBuilder().delete(path, handler);
    }
    /** Registers a `GET` route. See `RouterBuilder.get`. */
    static get(path, handler) {
        return new RouterBuilder().get(path, handler);
    }
    /** Registers a `HEAD` route. See `RouterBuilder.head`. */
    static head(path, handler) {
        return new RouterBuilder().head(path, handler);
    }
    /** Registers an `OPTIONS` route. See `RouterBuilder.options`. */
    static options(path, handler) {
        return new RouterBuilder().options(path, handler);
    }
    /** Registers a `PATCH` route. See `RouterBuilder.patch`. */
    static patch(path, handler) {
        return new RouterBuilder().patch(path, handler);
    }
    /** Registers a `POST` route. See `RouterBuilder.post`. */
    static post(path, handler) {
        return new RouterBuilder().post(path, handler);
    }
    /** Registers a `PUT` route. See `RouterBuilder.put`. */
    static put(path, handler) {
        return new RouterBuilder().put(path, handler);
    }
    /** Registers a `TRACE` route. See `RouterBuilder.trace`. */
    static trace(path, handler) {
        return new RouterBuilder().trace(path, handler);
    }
    /** Registers the same path/handler for multiple HTTP methods. See `RouterBuilder.match`. */
    static match(methods, path, handler) {
        return new RouterBuilder().match(methods, path, handler);
    }
    /** Registers a route that responds to every HTTP method. See `RouterBuilder.any`. */
    static any(path, handler) {
        return new RouterBuilder().any(path, handler);
    }
    /** Registers a WebSocket upgrade route. See `RouterBuilder.websocket`. */
    static websocket(path, handler) {
        return new RouterBuilder().websocket(path, handler);
    }
    /** Flattens routes/route groups into a single serialized route map. See `RouterBuilder.serialize`. */
    static serialize(routes) {
        return new RouterBuilder().serialize(routes);
    }
}
