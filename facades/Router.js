import { isEmpty } from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import RouterBuilder from "../builders/RouterBuilder";
export default class Router {
    static prefix(basePath) {
        return new RouterBuilder().prefix(basePath);
    }
    static middleware(...middlewares) {
        return new RouterBuilder().middleware(...middlewares);
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
        const builder = new RouterBuilder();
        const routeMap = {};
        for (const method of methods) {
            const single = builder.buildSingle(method, path, handler);
            const fullPath = Object.keys(single)[0];
            const handlers = single[fullPath];
            if (isEmpty(routeMap[fullPath]))
                routeMap[fullPath] = {};
            Object.assign(routeMap[fullPath], handlers);
        }
        return routeMap;
    }
    static any(path, handler) {
        return this.match(Enum.setEnums(HttpMethodEnum).toArray(), path, handler);
    }
}
