import { isEmpty } from "@bejibun/utils";
import path from "path";
import RouterInvalidException from "../exceptions/RouterInvalidException";
export default class RouterBuilder {
    basePath = "";
    middlewares = [];
    prefix(basePath) {
        this.basePath = basePath;
        return this;
    }
    middleware(...middlewares) {
        this.middlewares.push(...middlewares);
        return this;
    }
    group(routes) {
        const routeList = Array.isArray(routes) ? routes : [routes];
        const newRoutes = {};
        for (const route of routeList) {
            for (const path in route) {
                const fullPath = this.joinPaths(this.basePath, path);
                const routeHandlers = route[path];
                const wrappedHandlers = {};
                for (const method in routeHandlers) {
                    let handler = routeHandlers[method];
                    for (const middleware of this.middlewares) {
                        handler = middleware.handle(handler);
                    }
                    wrappedHandlers[method] = handler;
                }
                if (isEmpty(newRoutes[fullPath]))
                    newRoutes[fullPath] = {};
                Object.assign(newRoutes[fullPath], wrappedHandlers);
            }
        }
        return newRoutes;
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
        return this.group(filteredRoutes);
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
            [cleanPath]: {
                [method]: resolvedHandler
            }
        };
    }
    joinPaths(base, path) {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");
        return "/" + [base, path].filter(Boolean).join("/");
    }
    resolveControllerString(definition) {
        const [controllerName, methodName] = definition.split("@");
        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterInvalidException(`[RouterInvalidException]: Invalid router controller definition: ${definition}.`);
        }
        const controllerPath = path.resolve(process.cwd(), "app/controllers");
        const location = `${controllerPath}/${controllerName}`;
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
                    throw new RouterInvalidException(`[RouterInvalidException]: Method "${methodName}" not found in ${controllerName}.`);
                }
                return instance[methodName](...args);
            };
        }
        if (isEmpty(ControllerClass)) {
            throw new RouterInvalidException(`[RouterInvalidException]: Controller not found: ${controllerName}.`);
        }
        const instance = new ControllerClass();
        if (typeof instance[methodName] !== "function") {
            throw new RouterInvalidException(`[RouterInvalidException]: Method "${methodName}" not found in ${controllerName}.`);
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
}
