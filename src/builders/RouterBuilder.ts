import type {TFacilitator, TPaywall, TX402Config} from "@bejibun/x402";
import type {EnumItem} from "@bejibun/utils/facades/Enum";
import type {IMiddleware} from "@/types/middleware";
import type {HandlerType, RawRoute, ResourceAction, Route, RouterGroup, RouterMethodMap} from "@/types/router";
import App from "@bejibun/app";
import {defineValue, isEmpty, isModuleExists, isNotEmpty} from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import path from "path";
import RouterException from "@/exceptions/RouterException";

export interface ResourceOptions {
    only?: Array<ResourceAction>;
    except?: Array<ResourceAction>;
}

export default class RouterBuilder {
    private basePath: string = "";
    private middlewares: Array<IMiddleware> = [];
    private baseNamespace: string = "app/controllers";

    public prefix(basePath: string): RouterBuilder {
        this.basePath = basePath;

        return this;
    }

    public middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        this.middlewares.push(...middlewares);

        return this;
    }

    public namespace(baseNamespace: string): RouterBuilder {
        this.baseNamespace = baseNamespace;

        return this;
    }

    public x402(config?: TX402Config, facilitatorConfig?: TFacilitator, paywallConfig?: TPaywall): RouterBuilder {
        if (!isModuleExists("@bejibun/x402")) throw new RouterException("@bejibun/x402 is not installed.");

        const X402Middleware = require("@/middlewares/X402Middleware").default;
        this.middlewares.push(new X402Middleware(config, facilitatorConfig, paywallConfig));

        return this;
    }

    public group(routes: Route | Array<Route> | RouterGroup): RouterGroup | Array<RouterGroup> {
        if (this.hasRaw(routes)) {
            const routeList: Array<Route | RouterGroup> = Array.isArray(routes) ? routes.flat() : [routes];
            const routerGroups: Array<RouterGroup> = routeList.filter((value: Route | RouterGroup) => !this.hasRaw(value));
            const rawRoutes: Array<RawRoute> = routeList.filter((value: Route | RouterGroup) => this.hasRaw(value)).map((value: Route) => value.raw);
            const newRoutes: any = {};

            for (const route of rawRoutes) {
                const cleanPath: string = this.joinPaths(defineValue(route.prefix, this.basePath), route.path);

                let resolvedHandler: HandlerType = typeof route.handler === "string" ?
                    this.resolveControllerString(route.handler, defineValue(this.baseNamespace, route.namespace)) :
                    route.handler;

                for (const middleware of this.middlewares.concat(defineValue(route.middlewares, []))) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }

                if (isEmpty(newRoutes[cleanPath])) newRoutes[cleanPath] = {};

                Object.assign(newRoutes[cleanPath], {
                    [route.method]: resolvedHandler
                });
            }

            return Object.assign({}, ...routerGroups.map((value: RouterGroup) => this.applyGroup(value)), newRoutes);
        }

        if (isEmpty(routes)) return {};

        if (Array.isArray(routes)) return routes.map((route: RouterGroup) => this.applyGroup(route));

        return this.applyGroup(routes);
    }

    public resources(controller: Record<string, HandlerType>, options?: ResourceOptions): RouterGroup {
        const allRoutes: Record<string, Record<string, ResourceAction>> = {
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

        const includedActions: Set<ResourceAction> = this.resolveIncludedActions(options);

        const filteredRoutes: RouterGroup = {};

        for (const path in allRoutes) {
            const methods = allRoutes[path];
            const methodHandlers: Record<string, HandlerType> = {};

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

        return filteredRoutes
        // return this.group(filteredRoutes);
    }

    public buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): Route {
        const cleanPath: string = this.joinPaths(this.basePath, path);

        let resolvedHandler: HandlerType = typeof handler === "string" ?
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

    public connect(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Connect, path, handler);
    }

    public delete(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Delete, path, handler);
    }

    public get(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Get, path, handler);
    }

    public head(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Head, path, handler);
    }

    public options(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Options, path, handler);
    }

    public patch(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Patch, path, handler);
    }

    public post(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Post, path, handler);
    }

    public put(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Put, path, handler);
    }

    public trace(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Trace, path, handler);
    }

    public match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup {
        const routeMap: RouterGroup = {};

        for (const method of methods) {
            const single = this.buildSingle(method, path, handler).route;
            const fullPath = Object.keys(single)[0];
            const handlers = single[fullPath];

            if (isEmpty(routeMap[fullPath])) routeMap[fullPath] = {};

            Object.assign(routeMap[fullPath], handlers);
        }

        return routeMap;
    }

    public any(path: string, handler: string | HandlerType): RouterGroup {
        return this.match(Enum.setEnums(HttpMethodEnum).toArray().map((value: EnumItem) => value.value), path, handler);
    }

    public serialize(routes: Route | Array<Route> | RouterGroup | Array<RouterGroup>): RouterGroup | Array<RouterGroup> {
        if (Array.isArray(routes)) {
            if (this.hasRaw(routes)) return routes.map((value: Route) => value.route);
        } else {
            if (this.hasRaw(routes)) return routes.route;
        }

        return routes;
    }

    private joinPaths(base: string, path: string): string {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");

        return `/${[base, path].filter(Boolean).join("/")}`;
    }

    private resolveControllerString(definition: string, overrideNamespace?: string): HandlerType {
        const [controllerName, methodName] = definition.split("@");

        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterException(`Invalid router controller definition: ${definition}.`);
        }

        const controllerPath = path.resolve(App.Path.rootPath(), defineValue(overrideNamespace, this.baseNamespace));
        let location: any = null;

        try {
            location = Bun.resolveSync(`./${controllerName}.ts`, controllerPath);
        } catch {
            return async () => {
                throw new RouterException(`Invalid router for controller location [${controllerPath}]`);
            };
        }

        let ControllerClass: any;

        try {
            ControllerClass = require(location).default;
        } catch {
            return async (...args: any[]) => {
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

    private resolveIncludedActions(options?: ResourceOptions): Set<ResourceAction> {
        const all: Array<ResourceAction> = ["index", "store", "show", "update", "destroy"];

        if (options?.only) {
            return new Set(options.only);
        }

        if (options?.except) {
            return new Set(all.filter(action => !options.except!.includes(action)));
        }

        return new Set(all);
    }

    private hasRaw(routes: Route | Array<Route> | RouterGroup): routes is Route {
        if (Array.isArray(routes)) return routes.flat().some(route => isNotEmpty(route) && "raw" in route);

        return (
            isNotEmpty(routes) &&
            typeof routes === "object" &&
            "raw" in routes
        );
    }

    private isMethodMap(value: any): value is RouterMethodMap {
        return (
            isNotEmpty(value) &&
            typeof value === "object" &&
            Object.values(value).every(v => typeof v === "function")
        );
    }

    private applyGroup(route: RouterGroup): RouterGroup {
        const result: RouterGroup = {};

        for (const [key, value] of Object.entries(route)) {
            const newKey = key.startsWith("/") ? this.joinPaths(this.basePath, key) : key;

            if (this.isMethodMap(value)) {
                const wrappedMethods: RouterMethodMap = {};

                for (const [method, handler] of Object.entries(value)) {
                    let resolvedHandler: HandlerType = handler;

                    for (const middleware of this.middlewares) {
                        resolvedHandler = middleware.handle(resolvedHandler);
                    }

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