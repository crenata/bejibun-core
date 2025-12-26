import App from "@bejibun/app";
import { defineValue, isEmpty, isModuleExists, isNotEmpty } from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import path from "path";
import RouterException from "../exceptions/RouterException";
export default class RouterBuilder {
    basePath = "";
    middlewares = [];
    baseNamespace = "app/controllers";
    prefix(basePath) {
        this.basePath = basePath;
        return this;
    }
    middleware(...middlewares) {
        this.middlewares.push(...middlewares);
        return this;
    }
    namespace(baseNamespace) {
        this.baseNamespace = baseNamespace;
        return this;
    }
    x402(config, facilitatorConfig, paywallConfig) {
        if (!isModuleExists("@bejibun/x402"))
            throw new RouterException("@bejibun/x402 is not installed.");
        const X402Middleware = require("../middlewares/X402Middleware").default;
        this.middlewares.push(new X402Middleware(config, facilitatorConfig, paywallConfig));
        return this;
    }
    group(routes) {
        console.log(routes)
        if (this.hasRaw(routes)) {
            const routeList = (Array.isArray(routes) ? routes.flat().map(value => value.raw) : [routes.raw]).filter(value => isNotEmpty(value));
            const newRoutes = {};
            for (const route of routeList) {
                const cleanPath = this.joinPaths(defineValue(route.prefix, this.basePath), route.path);
                let resolvedHandler = typeof route.handler === "string" ?
                    this.resolveControllerString(route.handler, route.namespace) :
                    route.handler;
                for (const middleware of this.middlewares.concat(defineValue(route.middlewares, []))) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }
                if (isEmpty(newRoutes[cleanPath]))
                    newRoutes[cleanPath] = {};
                Object.assign(newRoutes[cleanPath], {
                    [route.method]: resolvedHandler
                });
            }
            return newRoutes;
        }
        if (isEmpty(routes))
            return {};
        return routes;
    }
    resources(controller, options) {
        const allRoutes = {
            "": {
                GET: "index",
                POST: "store"
            },
            ":id": {
                GET: "show",
                PUT: "update",
                DELETE: "destroy"
            }
        };
        const includedActions = this.resolveIncludedActions(options);
        const filteredRoutes = {};
        for (const path in allRoutes) {
            const methods = allRoutes[path];
            const methodHandlers = {};
            for (const method in methods) {
                const action = methods[method];
                if (includedActions.has(action) && controller[action]) {
                    methodHandlers[method] = controller[action];
                }
            }
            if (Object.keys(methodHandlers).length > 0) {
                filteredRoutes[path] = methodHandlers;
            }
        }
        return filteredRoutes;
        // return this.group(filteredRoutes);
    }
    buildSingle(method, path, handler) {
        const cleanPath = this.joinPaths(this.basePath, path);
        let resolvedHandler = typeof handler === "string" ?
            this.resolveControllerString(handler) :
            handler;
        for (const middleware of this.middlewares) {
            resolvedHandler = middleware.handle(resolvedHandler);
        }
        return {
            raw: {
                prefix: this.basePath,
                middlewares: this.middlewares,
                namespace: this.baseNamespace,
                method,
                path,
                handler
            },
            route: {
                [cleanPath]: {
                    [method]: resolvedHandler
                }
            }
        };
    }
    connect(path, handler) {
        return this.buildSingle(HttpMethodEnum.Connect, path, handler);
    }
    delete(path, handler) {
        return this.buildSingle(HttpMethodEnum.Delete, path, handler);
    }
    get(path, handler) {
        return this.buildSingle(HttpMethodEnum.Get, path, handler);
    }
    head(path, handler) {
        return this.buildSingle(HttpMethodEnum.Head, path, handler);
    }
    options(path, handler) {
        return this.buildSingle(HttpMethodEnum.Options, path, handler);
    }
    patch(path, handler) {
        return this.buildSingle(HttpMethodEnum.Patch, path, handler);
    }
    post(path, handler) {
        return this.buildSingle(HttpMethodEnum.Post, path, handler);
    }
    put(path, handler) {
        return this.buildSingle(HttpMethodEnum.Put, path, handler);
    }
    trace(path, handler) {
        return this.buildSingle(HttpMethodEnum.Trace, path, handler);
    }
    match(methods, path, handler) {
        const routeMap = {};
        for (const method of methods) {
            const single = this.buildSingle(method, path, handler).route;
            const fullPath = Object.keys(single)[0];
            const handlers = single[fullPath];
            if (isEmpty(routeMap[fullPath]))
                routeMap[fullPath] = {};
            Object.assign(routeMap[fullPath], handlers);
        }
        return routeMap;
    }
    any(path, handler) {
        return this.match(Enum.setEnums(HttpMethodEnum).toArray().map((value) => value.value), path, handler);
    }
    joinPaths(base, path) {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");
        return `/${[base, path].filter(Boolean).join("/")}`;
    }
    resolveControllerString(definition, overrideNamespace) {
        const [controllerName, methodName] = definition.split("@");
        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterException(`Invalid router controller definition: ${definition}.`);
        }
        const controllerPath = path.resolve(App.Path.rootPath(), defineValue(overrideNamespace, this.baseNamespace));
        const location = Bun.resolveSync(`./${controllerName}.ts`, controllerPath);
        let ControllerClass;
        try {
            ControllerClass = require(location).default;
        }
        catch {
            return async (...args) => {
                const module = await import(location);
                const ESMController = module.default;
                const instance = new ESMController();
                if (typeof instance[methodName] !== "function") {
                    throw new RouterException(`Method "${methodName}" not found in ${controllerName}.`);
                }
                return instance[methodName](...args);
            };
        }
        if (isEmpty(ControllerClass)) {
            throw new RouterException(`Controller not found: ${controllerName}.`);
        }
        const instance = new ControllerClass();
        if (typeof instance[methodName] !== "function") {
            throw new RouterException(`Method "${methodName}" not found in ${controllerName}.`);
        }
        return instance[methodName].bind(instance);
    }
    resolveIncludedActions(options) {
        const all = ["index", "store", "show", "update", "destroy"];
        if (options?.only) {
            return new Set(options.only);
        }
        if (options?.except) {
            return new Set(all.filter(action => !options.except.includes(action)));
        }
        return new Set(all);
    }
    hasRaw(routes) {
        if (Array.isArray(routes))
            return routes.flat().some(route => isNotEmpty(route) && "raw" in route);
        return isNotEmpty(routes) && typeof routes === "object" && "raw" in routes;
    }
}
