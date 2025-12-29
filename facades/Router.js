import RouterBuilder from "../builders/RouterBuilder";
export default class Router {
    static prefix(basePath) {
        return new RouterBuilder().prefix(basePath);
    }
    static middleware(...middlewares) {
        return new RouterBuilder().middleware(...middlewares);
    }
    static namespace(baseNamespace) {
        return new RouterBuilder().namespace(baseNamespace);
    }
    static x402() {
        return new RouterBuilder().x402();
    }
    static resources(controller, options) {
        return new RouterBuilder().resources(controller, options);
    }
    static group(routes) {
        return new RouterBuilder().group(routes);
    }
    static connect(path, handler) {
        return new RouterBuilder().connect(path, handler);
    }
    static delete(path, handler) {
        return new RouterBuilder().delete(path, handler);
    }
    static get(path, handler) {
        return new RouterBuilder().get(path, handler);
    }
    static head(path, handler) {
        return new RouterBuilder().head(path, handler);
    }
    static options(path, handler) {
        return new RouterBuilder().options(path, handler);
    }
    static patch(path, handler) {
        return new RouterBuilder().patch(path, handler);
    }
    static post(path, handler) {
        return new RouterBuilder().post(path, handler);
    }
    static put(path, handler) {
        return new RouterBuilder().put(path, handler);
    }
    static trace(path, handler) {
        return new RouterBuilder().trace(path, handler);
    }
    static match(methods, path, handler) {
        return new RouterBuilder().match(methods, path, handler);
    }
    static any(path, handler) {
        return new RouterBuilder().any(path, handler);
    }
    static serialize(routes) {
        return new RouterBuilder().serialize(routes);
    }
}
