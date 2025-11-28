import type {TFacilitator, TPaywall, TX402Config} from "@bejibun/x402";
import type {EnumItem} from "@bejibun/utils/facades/Enum";
import type {IMiddleware} from "@/types/middleware";
import type {HandlerType, ResourceAction, RouterGroup} from "@/types/router";
import App from "@bejibun/app";
import {isEmpty, isModuleExists} from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import path from "path";
import RouterInvalidException from "@/exceptions/RouterInvalidException";

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
        if (!isModuleExists("@bejibun/x402")) throw new RouterInvalidException("@bejibun/x402 is not installed.");

        const X402Middleware = require("@/middlewares/X402Middleware").default;
        this.middlewares.push(new X402Middleware(config, facilitatorConfig, paywallConfig));

        return this;
    }

    public group(routes: RouterGroup | Array<RouterGroup>): RouterGroup {
        const routeList = Array.isArray(routes) ? routes : [routes];
        const newRoutes: RouterGroup = {};

        for (const route of routeList) {
            for (const path in route) {
                const fullPath = this.joinPaths(this.basePath, path);
                const routeHandlers = route[path];
                const wrappedHandlers: Record<string, HandlerType> = {};

                for (const method in routeHandlers) {
                    let handler = routeHandlers[method];

                    for (const middleware of this.middlewares) {
                        handler = middleware.handle(handler);
                    }

                    wrappedHandlers[method] = handler;
                }

                if (isEmpty(newRoutes[fullPath])) newRoutes[fullPath] = {};

                Object.assign(newRoutes[fullPath], wrappedHandlers);
            }
        }

        return newRoutes;
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

        const includedActions = this.resolveIncludedActions(options);

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

        return this.group(filteredRoutes);
    }

    public buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): RouterGroup {
        const cleanPath = this.joinPaths(this.basePath, path);

        let resolvedHandler: HandlerType = typeof handler === "string" ?
            this.resolveControllerString(handler) :
            handler;

        for (const middleware of this.middlewares) {
            resolvedHandler = middleware.handle(resolvedHandler);
        }

        return {
            [cleanPath]: {
                [method]: resolvedHandler
            }
        };
    }

    public match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup {
        const routeMap: RouterGroup = {};

        for (const method of methods) {
            const single = this.buildSingle(method, path, handler);
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

    private joinPaths(base: string, path: string): string {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");

        return `/${[base, path].filter(Boolean).join("/")}`;
    }

    private resolveControllerString(definition: string): HandlerType {
        const [controllerName, methodName] = definition.split("@");

        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterInvalidException(`Invalid router controller definition: ${definition}.`);
        }

        const controllerPath = path.resolve(App.Path.rootPath(), this.baseNamespace);
        const location = Bun.resolveSync(`./${controllerName}.ts`, controllerPath);

        let ControllerClass: any;

        try {
            ControllerClass = require(location).default;
        } catch {
            return async (...args: any[]) => {
                const module = await import(location);
                const ESMController = module.default;
                const instance = new ESMController();

                if (typeof instance[methodName] !== "function") {
                    throw new RouterInvalidException(`Method "${methodName}" not found in ${controllerName}.`);
                }

                return instance[methodName](...args);
            };
        }

        if (isEmpty(ControllerClass)) {
            throw new RouterInvalidException(`Controller not found: ${controllerName}.`);
        }

        const instance = new ControllerClass();

        if (typeof instance[methodName] !== "function") {
            throw new RouterInvalidException(`Method "${methodName}" not found in ${controllerName}.`);
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
}