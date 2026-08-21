import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty, isModuleExists, isNotEmpty } from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import "reflect-metadata";
import { ApiDocDecoratorKey } from "../decorators/ApiDocDecorator";
import RouterException from "../exceptions/RouterException";
export default class RouterBuilder {
    basePath = "";
    middlewares = [];
    baseNamespace = "app/controllers";
    apiDoc = {
        description: "",
        deprecated: false,
        request: {
            params: []
        },
        response: {}
    };
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
    x402(facilitator, routePayment) {
        if (!isModuleExists("@bejibun/x402"))
            throw new RouterException("@bejibun/x402 is not installed.");
        const X402Middleware = require("../middlewares/X402Middleware").default;
        this.middlewares.push(new X402Middleware(facilitator, routePayment));
        return this;
    }
    group(routes) {
        const rawGroups = [];
        let routeGroups = {};
        if (this.hasRaws(routes)) {
            const routeList = Array.isArray(routes)
                ? routes.flat()
                : [routes];
            const routerGroups = routeList.filter((value) => !this.hasRaws(value) && !this.hasRaw(value));
            const rawRoutes = routeList
                .filter((value) => this.hasRaws(value))
                .map((value) => value.raws)
                .flat();
            const newRoutes = {};
            for (const route of rawRoutes) {
                const middlewares = this.middlewares.concat(defineValue(route.raw.middlewares, []));
                const effectiveNamespace = route.raw.websocket
                    ? defineValue("app/websockets", route.raw.namespace)
                    : defineValue(this.baseNamespace, route.raw.namespace);
                const cleanPath = this.joinPaths(defineValue(route.raw.prefix, this.basePath), route.raw.path);
                let resolvedHandler = typeof route.raw.handler === "string"
                    ? this.resolveControllerString(route.raw.handler, effectiveNamespace, route.raw.websocket
                        ? {
                            path: cleanPath
                        }
                        : undefined)
                    : route.raw.handler;
                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }
                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);
                if (isEmpty(newRoutes[cleanPath]))
                    newRoutes[cleanPath] = {};
                if (isEmpty(route.raw.method)) {
                    newRoutes[cleanPath] = resolvedHandler;
                }
                else {
                    Object.assign(newRoutes[cleanPath], {
                        [route.raw.method]: resolvedHandler
                    });
                }
                route.raw.middlewares = middlewares;
                route.raw.namespace = effectiveNamespace;
                route.raw.path = cleanPath;
                rawGroups.push(route);
            }
            routeGroups = Object.assign({}, ...routerGroups.map((value) => this.applyGroup(value)), newRoutes);
        }
        if (this.hasRaw(routes)) {
            const routeList = Array.isArray(routes)
                ? routes.flat()
                : [routes];
            const routerGroups = routeList.filter((value) => !this.hasRaws(value) && !this.hasRaw(value));
            const rawRoutes = routeList.filter((value) => this.hasRaw(value));
            const newRoutes = {};
            for (const route of rawRoutes) {
                const middlewares = this.middlewares.concat(defineValue(route.raw.middlewares, []));
                const effectiveNamespace = route.raw.websocket
                    ? defineValue("app/websockets", route.raw.namespace)
                    : defineValue(this.baseNamespace, route.raw.namespace);
                const cleanPath = this.joinPaths(defineValue(route.raw.prefix, this.basePath), route.raw.path);
                let resolvedHandler = typeof route.raw.handler === "string"
                    ? this.resolveControllerString(route.raw.handler, effectiveNamespace, route.raw.websocket
                        ? {
                            path: cleanPath
                        }
                        : undefined)
                    : route.raw.handler;
                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }
                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);
                if (isEmpty(newRoutes[cleanPath]))
                    newRoutes[cleanPath] = {};
                if (isEmpty(route.raw.method)) {
                    newRoutes[cleanPath] = resolvedHandler;
                }
                else {
                    Object.assign(newRoutes[cleanPath], {
                        [route.raw.method]: resolvedHandler
                    });
                }
                route.raw.middlewares = middlewares;
                route.raw.namespace = effectiveNamespace;
                route.raw.path = cleanPath;
                rawGroups.push(route);
            }
            routeGroups = Object.assign({}, ...routerGroups.map((value) => this.applyGroup(value)), newRoutes);
        }
        if (isNotEmpty(routeGroups))
            return {
                raws: rawGroups,
                routes: routeGroups
            };
        if (isEmpty(routes))
            return {};
        if (Array.isArray(routes)) {
            return routes
                .map((value) => {
                if (isNotEmpty(value.raws))
                    return value.raws;
                return value;
            })
                .flat()
                .map((route) => this.applyGroup(route));
        }
        return this.applyGroup(routes);
    }
    resource(path, controller, options) {
        const ClassController = new controller();
        const cleanPath = this.joinPaths(this.basePath, path);
        const allRoutes = {
            [cleanPath]: {
                GET: "index",
                POST: "store"
            },
            [`${cleanPath}/:id`]: {
                GET: "show",
                PUT: "update",
                DELETE: "destroy"
            }
        };
        const includedActions = this.resolveIncludedActions(options);
        const raws = [];
        const routes = {};
        for (const path in allRoutes) {
            const methods = allRoutes[path];
            const methodMap = {};
            for (const method in methods) {
                const action = methods[method];
                const handler = ClassController[action];
                if (includedActions.has(action) && isNotEmpty(handler)) {
                    raws.push({
                        raw: {
                            prefix: this.basePath,
                            middlewares: [],
                            namespace: this.baseNamespace,
                            apiDoc: this.apiDoc,
                            method,
                            path,
                            handler
                        },
                        route: {
                            [path]: {
                                [method]: handler
                            }
                        }
                    });
                }
            }
            if (Object.keys(methodMap).length > 0) {
                routes[path] = methodMap;
            }
        }
        return this.applyGroup({
            raws,
            routes
        });
    }
    buildSingle(method, path, handler) {
        const cleanPath = this.joinPaths(this.basePath, path);
        let resolvedHandler = typeof handler === "string" ? this.resolveControllerString(handler) : handler;
        for (const middleware of [...this.middlewares].reverse()) {
            resolvedHandler = middleware.handle(resolvedHandler);
        }
        resolvedHandler = this.attachRequestHelpers(resolvedHandler);
        return {
            raw: {
                prefix: this.basePath,
                middlewares: this.middlewares,
                namespace: this.baseNamespace,
                apiDoc: this.apiDoc,
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
        const routers = [];
        for (const method of methods) {
            routers.push(this.buildSingle(method, path, handler));
        }
        return this.group(routers);
    }
    any(path, handler) {
        return this.match(Enum.setEnums(HttpMethodEnum)
            .toArray()
            .map((value) => value.value), path, handler);
    }
    websocket(path, handler) {
        const cleanPath = this.joinPaths(this.basePath, path);
        let resolvedHandler = (request, server) => {
            server.upgrade(request, {
                data: {
                    id: Bun.randomUUIDv7(),
                    path: cleanPath
                }
            });
        };
        for (const middleware of [...this.middlewares].reverse()) {
            resolvedHandler = middleware.handle(resolvedHandler);
        }
        return {
            raw: {
                prefix: this.basePath,
                middlewares: this.middlewares,
                namespace: "app/websockets",
                apiDoc: this.apiDoc,
                method: "",
                path,
                websocket: true,
                handler
            },
            route: {
                [cleanPath]: resolvedHandler
            }
        };
    }
    serialize(routes) {
        if (Array.isArray(routes)) {
            if (this.hasRaw(routes))
                routes = routes.map((value) => value.route);
            if (this.hasRaws(routes))
                routes = routes.map((value) => value.routes).flat();
        }
        else {
            if (this.hasRaw(routes))
                routes = routes.route;
            if (this.hasRaws(routes))
                routes = routes.routes;
        }
        const mergedRoutes = this.mergeRoutes(routes);
        if (Array.isArray(mergedRoutes))
            return Object.assign({}, ...mergedRoutes);
        return mergedRoutes;
    }
    mergeRoutes(routes) {
        const merged = {};
        const routeEntries = Array.isArray(routes)
            ? routes
            : Object.entries(routes).map(([path, methods]) => ({
                [path]: methods
            }));
        for (const route of routeEntries) {
            for (const [path, methods] of Object.entries(route)) {
                if (isEmpty(merged[path]))
                    merged[path] = {};
                for (const [method, handler] of Object.entries(methods)) {
                    if (isNotEmpty(merged[path][method]))
                        Logger.setContext("Router").warn(`Duplicate route: ${method} ${path} - overwriting.`);
                    merged[path][method] = handler;
                }
            }
        }
        return merged;
    }
    /**
     * Wraps a handler so every request arriving at it has the predefined
     * Bejibun.Request accessor methods (`get`, `set`, `array`, `boolean`,
     * `float`, `integer`, `object`, `string`) available - regardless of
     * whether `RequestMiddleware` (or any other middleware) was attached
     * to the route.
     *
     * Applied as the outermost wrap around every resolved handler, so it
     * runs before any user middleware and the controller itself. The
     * accessors read `request.payload` lazily at call time, so it doesn't
     * matter that `payload` may not be populated yet when this wrapper runs -
     * only that it's populated by the time `request.integer(...)` etc. is
     * actually called (typically by `RequestMiddleware`, if attached).
     */
    attachRequestHelpers(handler) {
        return async (request, server) => {
            if (isEmpty(request.payload))
                request.payload = {};
            request.get = (key) => request.payload?.[key];
            request.set = (key, value) => {
                if (isEmpty(request.payload))
                    request.payload = {};
                request.payload[key] = value;
            };
            request.array = (key) => {
                const value = request.get(key);
                return Array.isArray(value) ? value : [value];
            };
            request.boolean = (key) => {
                const value = request.get(key);
                return value === true || value === "true" || value === "1" || value === 1;
            };
            request.float = (key) => {
                const value = parseFloat(request.get(key));
                return Number.isNaN(value) ? 0 : value;
            };
            request.integer = (key) => {
                const value = parseInt(request.get(key), 10);
                return Number.isNaN(value) ? 0 : value;
            };
            request.object = (key) => {
                const value = request.get(key);
                return typeof value === "object" && value !== null ? value : {};
            };
            request.string = (key) => {
                const value = request.get(key);
                return value === undefined || value === null ? "" : String(value);
            };
            return handler(request, server);
        };
    }
    joinPaths(base, path) {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");
        return `/${[base, path].filter(Boolean).join("/")}`;
    }
    resolveControllerString(definition, overrideNamespace, websocket) {
        const [controllerName, methodName] = definition.split("@");
        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterException(`Invalid router controller definition: ${definition}.`);
        }
        const controllerPath = App.Path.rootPath(defineValue(overrideNamespace, this.baseNamespace));
        let location = null;
        try {
            location = Bun.resolveSync(`./${controllerName}.ts`, controllerPath);
        }
        catch {
            return async () => {
                throw new RouterException(`Invalid router for controller location [${controllerPath}]`);
            };
        }
        let ControllerClass;
        try {
            ControllerClass = require(location).default;
            if (isNotEmpty(websocket))
                ControllerClass.path = websocket?.path;
            this.apiDoc = Reflect.getMetadata(ApiDocDecoratorKey, ControllerClass.prototype, methodName);
        }
        catch {
            return async (...args) => {
                const module = await import(location);
                const ESMController = module.default;
                if (isNotEmpty(websocket))
                    ESMController.path = websocket?.path;
                this.apiDoc = Reflect.getMetadata(ApiDocDecoratorKey, ESMController.prototype, methodName);
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
            return new Set(all.filter((action) => !options.except.includes(action)));
        }
        return new Set(all);
    }
    hasRaw(routes) {
        if (Array.isArray(routes))
            return routes.flat().some((route) => isNotEmpty(route) && "raw" in route);
        return isNotEmpty(routes) && typeof routes === "object" && "raw" in routes;
    }
    hasRaws(routes) {
        if (Array.isArray(routes))
            return routes.flat().some((route) => isNotEmpty(route) && "raws" in route);
        return isNotEmpty(routes) && typeof routes === "object" && "raws" in routes;
    }
    isMethodMap(value) {
        return (isNotEmpty(value) &&
            typeof value === "object" &&
            Object.values(value).every((v) => typeof v === "function"));
    }
    applyGroup(route) {
        if (isEmpty(route))
            return route;
        if (this.hasRaw(route)) {
            const routeList = Array.isArray(route)
                ? route.flat()
                : [route];
            const rawRoutes = routeList.filter((value) => this.hasRaw(value));
            const newRoutes = {};
            const rawGroups = [];
            for (const route of rawRoutes) {
                const middlewares = route.raw.middlewares.concat(defineValue(this.middlewares, []));
                const cleanPath = this.joinPaths(defineValue(route.raw.prefix, this.basePath), route.raw.path);
                const effectiveNamespace = route.raw.websocket
                    ? defineValue(this.baseNamespace === "app/websockets" ? null : this.baseNamespace, route.raw.namespace)
                    : defineValue(this.baseNamespace === "app/controllers" ? null : this.baseNamespace, route.raw.namespace);
                let resolvedHandler = typeof route.raw.handler === "string"
                    ? this.resolveControllerString(route.raw.handler, effectiveNamespace, route.raw.websocket
                        ? {
                            path: cleanPath
                        }
                        : undefined)
                    : route.raw.handler;
                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }
                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);
                if (isEmpty(newRoutes[cleanPath]))
                    newRoutes[cleanPath] = {};
                Object.assign(newRoutes[cleanPath], {
                    [route.raw.method]: resolvedHandler
                });
                route.raw.middlewares = middlewares;
                route.raw.namespace = effectiveNamespace;
                route.raw.path = cleanPath;
                rawGroups.push(route);
            }
            if (isNotEmpty(rawGroups))
                return {
                    raws: rawGroups,
                    routes: newRoutes
                };
            return newRoutes;
        }
        const result = {};
        for (const [key, value] of Object.entries(route)) {
            const newKey = key.startsWith("/") ? this.joinPaths(this.basePath, key) : key;
            if (this.isMethodMap(value)) {
                const wrappedMethods = {};
                for (const [method, handler] of Object.entries(value)) {
                    let resolvedHandler = handler;
                    for (const middleware of [...this.middlewares].reverse()) {
                        resolvedHandler = middleware.handle(resolvedHandler);
                    }
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);
                    wrappedMethods[method] = resolvedHandler;
                }
                result[newKey] = wrappedMethods;
                continue;
            }
            if (isNotEmpty(value) && typeof value === "object") {
                result[newKey] = this.applyGroup(value);
                continue;
            }
            result[newKey] = value;
        }
        return result;
    }
}
