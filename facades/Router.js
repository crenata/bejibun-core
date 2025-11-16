import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
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
    static group(routes, prefix, middlewares) {
        const builder = new RouterBuilder();
        if (prefix)
            builder.prefix(prefix);
        if (middlewares?.length)
            builder.middleware(...middlewares);
        return builder.group(routes);
    }
    static connect(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Connect, path, handler);
    }
    static delete(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Delete, path, handler);
    }
    static get(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Get, path, handler);
    }
    static head(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Head, path, handler);
    }
    static options(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Options, path, handler);
    }
    static patch(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Patch, path, handler);
    }
    static post(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Post, path, handler);
    }
    static put(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Put, path, handler);
    }
    static trace(path, handler) {
        return new RouterBuilder().buildSingle(HttpMethodEnum.Trace, path, handler);
    }
    static match(methods, path, handler) {
        return new RouterBuilder().match(methods, path, handler);
    }
    static any(path, handler) {
        return new RouterBuilder().any(path, handler);
    }
}
