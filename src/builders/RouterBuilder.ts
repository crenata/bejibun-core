import type {EnumItem} from "@bejibun/utils/facades/Enum";
import type {TFacilitator, TRoutePayment} from "@bejibun/x402/types";
import type {ApiDocConfig} from "@/decorators/ApiDocDecorator";
import type {IMiddleware} from "@/types/middleware";
import type {
    HandlerType,
    RawsRoute,
    ResourceAction,
    ResourceOptions,
    Route,
    RouterGroup,
    RouterMethodMap
} from "@/types/router";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty, isModuleExists, isNotEmpty} from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import Enum from "@bejibun/utils/facades/Enum";
import "reflect-metadata";
import BaseController from "@/bases/BaseController";
import {ApiDocDecoratorKey} from "@/decorators/ApiDocDecorator";
import RouterException from "@/exceptions/RouterException";
import {validatePayload} from "@/utils/validate";

/**
 * Fluent builder used to define, group, and compile application routes.
 *
 * Each instance accumulates a base path, middleware stack, and controller
 * namespace via its chained setters (`prefix`, `middleware`, `namespace`),
 * then exposes HTTP-verb methods (`get`, `post`, ...), `resource()` for
 * RESTful CRUD routes, and `websocket()` for upgrade routes. Individual
 * routes and route groups are combined with `group()` and finally flattened
 * into a plain `{ path: { METHOD: handler } }` map via `serialize()`,
 * which is what gets handed off to Bun's router.
 */
export default class RouterBuilder {
    protected basePath: string = "";
    protected middlewares: Array<IMiddleware> = [];
    protected baseNamespace: string = "app/controllers";
    protected apiDoc: ApiDocConfig = {
        description: "",
        deprecated: false,
        request: {
            params: []
        },
        response: {}
    };

    /**
     * Sets the base path prepended to every route defined by this builder.
     *
     * @param basePath - The path prefix (e.g. `/api/v1`).
     * @returns This builder, for chaining.
     */
    public prefix(basePath: string): RouterBuilder {
        this.basePath = basePath;

        return this;
    }

    /**
     * Appends one or more middlewares to the stack applied to every route
     * defined by this builder. Middlewares run in the order given, wrapping
     * the handler from the outside in (last middleware pushed runs closest
     * to the handler).
     *
     * @param middlewares - The middleware instances to add.
     * @returns This builder, for chaining.
     */
    public middleware(...middlewares: Array<IMiddleware>): RouterBuilder {
        this.middlewares.push(...middlewares);

        return this;
    }

    /**
     * Sets the base controller namespace (directory) used to resolve
     * string-based handlers (e.g. `"UserController@index"`).
     *
     * @param baseNamespace - The namespace/directory controllers are resolved from.
     * @returns This builder, for chaining.
     */
    public namespace(baseNamespace: string): RouterBuilder {
        this.baseNamespace = baseNamespace;

        return this;
    }

    /**
     * Attaches x402 payment-gated middleware to every route defined by
     * this builder. Requires the optional `@bejibun/x402` package to be
     * installed.
     *
     * @param facilitator - Optional x402 payment facilitator configuration.
     * @param routePayment - Optional per-route payment requirements.
     * @returns This builder, for chaining.
     * @throws {RouterException} If `@bejibun/x402` is not installed.
     */
    public x402(facilitator?: TFacilitator, routePayment?: TRoutePayment): RouterBuilder {
        if (!isModuleExists("@bejibun/x402"))
            throw new RouterException("@bejibun/x402 is not installed.");

        const X402Middleware = require("@/middlewares/X402Middleware").default;
        this.middlewares.push(new X402Middleware(facilitator, routePayment));

        return this;
    }

    /**
     * Groups one or more routes (or nested route groups) together, applying
     * this builder's current prefix, middleware stack, and namespace to
     * each. Accepts a single `Route`, an array of `Route`/`RouterGroup`
     * values, or an already-grouped `RouterGroup`, and normalizes them all
     * into a single merged group.
     *
     * Internally this resolves every raw route's handler, wraps it with the
     * effective middleware chain (plus `attachRequestHelpers`, unless it's
     * a websocket route), and rewrites its path/namespace/middlewares to
     * reflect the group's settings before merging everything into one
     * `RouterGroup`.
     *
     * @param routes - The route(s) or group(s) to combine.
     * @returns The merged route group (or an array of groups, for array input without raw routes).
     */
    public group(routes: Route | Array<Route> | RouterGroup): RouterGroup | Array<RouterGroup> {
        const rawGroups: Array<Route> = [];
        let routeGroups: RouterGroup = {};

        if (this.hasRaws(routes)) {
            const routeList: Array<RawsRoute | Route | RouterGroup> = Array.isArray(routes)
                ? routes.flat()
                : [routes];
            const routerGroups: Array<RouterGroup> = routeList.filter(
                (value: Route | RouterGroup) => !this.hasRaws(value) && !this.hasRaw(value)
            );
            const rawRoutes: Array<Route> = routeList
                .filter((value: Route | RouterGroup) => this.hasRaws(value))
                .map((value: RawsRoute) => value.raws)
                .flat();
            const newRoutes: Record<string, any> = {};

            for (const route of rawRoutes) {
                const middlewares: Array<IMiddleware> = this.middlewares.concat(
                    defineValue(route.raw.middlewares, [])
                );
                const effectiveNamespace: string = route.raw.websocket
                    ? defineValue("app/websockets", route.raw.namespace)
                    : defineValue(this.baseNamespace, route.raw.namespace);
                const cleanPath: string = this.joinPaths(
                    defineValue(route.raw.prefix, this.basePath),
                    route.raw.path
                );

                let resolvedHandler: HandlerType =
                    typeof route.raw.handler === "string"
                        ? this.resolveControllerString(
                              route.raw.handler,
                              effectiveNamespace,
                              route.raw.websocket
                                  ? {
                                        path: cleanPath
                                    }
                                  : undefined
                          )
                        : route.raw.handler;

                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }

                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);

                if (isEmpty(newRoutes[cleanPath])) newRoutes[cleanPath] = {};

                if (isEmpty(route.raw.method)) {
                    newRoutes[cleanPath] = resolvedHandler;
                } else {
                    Object.assign(newRoutes[cleanPath], {
                        [route.raw.method]: resolvedHandler
                    });
                }

                route.raw.middlewares = middlewares;
                route.raw.namespace = effectiveNamespace;
                route.raw.path = cleanPath;

                rawGroups.push(route);
            }

            routeGroups = Object.assign(
                {},
                ...routerGroups.map((value: RouterGroup) => this.applyGroup(value)),
                newRoutes
            );
        }

        if (this.hasRaw(routes)) {
            const routeList: Array<Route | RouterGroup> = Array.isArray(routes)
                ? routes.flat()
                : [routes];
            const routerGroups: Array<RouterGroup> = routeList.filter(
                (value: Route | RouterGroup) => !this.hasRaws(value) && !this.hasRaw(value)
            );
            const rawRoutes: Array<Route> = routeList.filter((value: Route | RouterGroup) =>
                this.hasRaw(value)
            );
            const newRoutes: Record<string, any> = {};

            for (const route of rawRoutes) {
                const middlewares: Array<IMiddleware> = this.middlewares.concat(
                    defineValue(route.raw.middlewares, [])
                );
                const effectiveNamespace: string = route.raw.websocket
                    ? defineValue("app/websockets", route.raw.namespace)
                    : defineValue(this.baseNamespace, route.raw.namespace);
                const cleanPath: string = this.joinPaths(
                    defineValue(route.raw.prefix, this.basePath),
                    route.raw.path
                );

                let resolvedHandler: HandlerType =
                    typeof route.raw.handler === "string"
                        ? this.resolveControllerString(
                              route.raw.handler,
                              effectiveNamespace,
                              route.raw.websocket
                                  ? {
                                        path: cleanPath
                                    }
                                  : undefined
                          )
                        : route.raw.handler;

                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }

                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);

                if (isEmpty(newRoutes[cleanPath])) newRoutes[cleanPath] = {};

                if (isEmpty(route.raw.method)) {
                    newRoutes[cleanPath] = resolvedHandler;
                } else {
                    Object.assign(newRoutes[cleanPath], {
                        [route.raw.method]: resolvedHandler
                    });
                }

                route.raw.middlewares = middlewares;
                route.raw.namespace = effectiveNamespace;
                route.raw.path = cleanPath;

                rawGroups.push(route);
            }

            routeGroups = Object.assign(
                {},
                ...routerGroups.map((value: RouterGroup) => this.applyGroup(value)),
                newRoutes
            );
        }

        if (isNotEmpty(routeGroups))
            return {
                raws: rawGroups,
                routes: routeGroups
            };

        if (isEmpty(routes)) return {};

        if (Array.isArray(routes)) {
            return routes
                .map((value: RawsRoute | Route | RouterGroup) => {
                    if (isNotEmpty(value.raws)) return value.raws;

                    return value;
                })
                .flat()
                .map((route: RouterGroup | Route) => this.applyGroup(route));
        }

        return this.applyGroup(routes);
    }

    /**
     * Registers RESTful CRUD routes for a controller, mirroring Laravel's
     * `Route::resource()`. Generates:
     * - `GET {path}` -> `index`
     * - `POST {path}` -> `store`
     * - `GET {path}/:id` -> `show`
     * - `PUT {path}/:id` -> `update`
     * - `DELETE {path}/:id` -> `destroy`
     *
     * Only actions that exist as methods on the controller are registered;
     * `options.only`/`options.except` further narrow which actions apply.
     *
     * @param path - The base resource path (e.g. `/users`).
     * @param controller - The controller class providing the resource actions.
     * @param options - Optional `only`/`except` action filters.
     * @returns The resulting route group.
     */
    public resource(
        path: string,
        controller: typeof BaseController,
        options?: ResourceOptions
    ): RouterGroup {
        const ClassController: any = new controller();
        const cleanPath: string = this.joinPaths(this.basePath, path);

        const allRoutes: Record<string, Record<string, ResourceAction>> = {
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

        const includedActions: Set<ResourceAction> = this.resolveIncludedActions(options);

        const raws: Array<Route> = [];
        const routes: RouterGroup = {};

        for (const path in allRoutes) {
            const methods: Record<string, string> = allRoutes[path];
            const methodMap: RouterMethodMap = {};

            for (const method in methods) {
                const action: string = methods[method];
                const handler: any = ClassController[action];

                if (includedActions.has(action as ResourceAction) && isNotEmpty(handler)) {
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

    /**
     * Builds a single-method route: resolves the handler (from a
     * `"Controller@method"` string or a direct function), wraps it with
     * this builder's middleware stack and `attachRequestHelpers`, and
     * returns both the raw route definition and its serialized form.
     *
     * This is the common implementation behind `get`, `post`, `put`, etc.
     *
     * @param method - The HTTP method to register.
     * @param path - The route path, relative to this builder's prefix.
     * @param handler - A `"Controller@method"` string or a handler function.
     * @returns The built route.
     */
    public buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): Route {
        const cleanPath: string = this.joinPaths(this.basePath, path);

        let resolvedHandler: HandlerType =
            typeof handler === "string" ? this.resolveControllerString(handler) : handler;

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

    /** Registers a `CONNECT` route. @param path - Route path. @param handler - Controller string or handler function. */
    public connect(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Connect, path, handler);
    }

    /** Registers a `DELETE` route. @param path - Route path. @param handler - Controller string or handler function. */
    public delete(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Delete, path, handler);
    }

    /** Registers a `GET` route. @param path - Route path. @param handler - Controller string or handler function. */
    public get(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Get, path, handler);
    }

    /** Registers a `HEAD` route. @param path - Route path. @param handler - Controller string or handler function. */
    public head(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Head, path, handler);
    }

    /** Registers an `OPTIONS` route. @param path - Route path. @param handler - Controller string or handler function. */
    public options(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Options, path, handler);
    }

    /** Registers a `PATCH` route. @param path - Route path. @param handler - Controller string or handler function. */
    public patch(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Patch, path, handler);
    }

    /** Registers a `POST` route. @param path - Route path. @param handler - Controller string or handler function. */
    public post(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Post, path, handler);
    }

    /** Registers a `PUT` route. @param path - Route path. @param handler - Controller string or handler function. */
    public put(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Put, path, handler);
    }

    /** Registers a `TRACE` route. @param path - Route path. @param handler - Controller string or handler function. */
    public trace(path: string, handler: string | HandlerType): Route {
        return this.buildSingle(HttpMethodEnum.Trace, path, handler);
    }

    /**
     * Registers the same path/handler for multiple HTTP methods at once.
     *
     * @param methods - The HTTP methods to register the route under.
     * @param path - The route path.
     * @param handler - A `"Controller@method"` string or a handler function.
     * @returns The merged route group covering all given methods.
     */
    public match(
        methods: Array<HttpMethodEnum>,
        path: string,
        handler: string | HandlerType
    ): RouterGroup {
        const routers: Array<Route> = [];

        for (const method of methods) {
            routers.push(this.buildSingle(method, path, handler));
        }

        return this.group(routers);
    }

    /**
     * Registers a route that responds to every HTTP method.
     *
     * @param path - The route path.
     * @param handler - A `"Controller@method"` string or a handler function.
     * @returns The merged route group covering every HTTP method.
     */
    public any(path: string, handler: string | HandlerType): RouterGroup {
        return this.match(
            Enum.setEnums(HttpMethodEnum)
                .toArray()
                .map((value: EnumItem) => value.value),
            path,
            handler
        );
    }

    /**
     * Registers a WebSocket upgrade route. The handler itself just performs
     * the `server.upgrade()` call (tagging the connection with a random UUID
     * and the resolved path); actual message handling is expected to live
     * in a `BaseWebSocket` implementation resolved separately by `path`.
     *
     * Unlike HTTP routes, websocket handlers are NOT wrapped with
     * `attachRequestHelpers`, since there's no request/response payload
     * cycle once the connection is upgraded.
     *
     * @param path - The route path clients connect to.
     * @param handler - A `"Controller@method"` string or a handler function (used to resolve the associated websocket class).
     * @returns The built websocket route.
     */
    public websocket(path: string, handler: string | HandlerType): Route {
        const cleanPath: string = this.joinPaths(this.basePath, path);

        let resolvedHandler: any = (request: Bejibun.Request, server: Bun.Server<any>) => {
            server.upgrade(request, {
                data: {
                    id: Bun.randomUUIDv7(),
                    path: cleanPath
                } as any
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

    /**
     * Flattens routes/route groups produced by `group()`, `resource()`, or
     * the HTTP-verb builders into a single plain `{ path: { METHOD: handler } }`
     * map, ready to be passed to Bun's `routes` option.
     *
     * Unwraps `raw`/`raws` wrapper objects first (if present), then merges
     * everything via `mergeRoutes`, logging a warning for any duplicate
     * `METHOD path` combination (the later one wins).
     *
     * @param routes - The route(s)/group(s) to serialize.
     * @returns The flattened route map.
     */
    public serialize(
        routes: Route | Array<Route> | RouterGroup | Array<RouterGroup> | Array<RawsRoute>
    ): RouterGroup {
        if (Array.isArray(routes)) {
            if (this.hasRaw(routes)) routes = routes.map((value: Route) => value.route);
            if (this.hasRaws(routes))
                routes = (routes as any).map((value: any) => value.routes).flat();
        } else {
            if (this.hasRaw(routes)) routes = routes.route;
            if (this.hasRaws(routes)) routes = routes.routes;
        }

        const mergedRoutes = this.mergeRoutes(routes);

        if (Array.isArray(mergedRoutes)) return Object.assign({}, ...mergedRoutes);

        return mergedRoutes;
    }

    /**
     * Merges an array (or single object) of `RouterGroup` path maps into
     * one, warning (via `Logger`) and overwriting when the same
     * `METHOD path` combination is registered more than once.
     *
     * @param routes - The route group(s) to merge.
     * @returns The merged route group.
     */
    private mergeRoutes(routes: RouterGroup | Array<RouterGroup>): RouterGroup {
        const merged: RouterGroup = {};

        const routeEntries = Array.isArray(routes)
            ? routes
            : Object.entries(routes).map(([path, methods]) => ({
                  [path]: methods
              }));

        for (const route of routeEntries) {
            for (const [path, methods] of Object.entries(route)) {
                if (isEmpty(merged[path])) merged[path] = {};

                for (const [method, handler] of Object.entries(methods as RouterMethodMap)) {
                    if (isNotEmpty(merged[path][method]))
                        Logger.setContext("Router").warn(
                            `Duplicate route: ${method} ${path} - overwriting.`
                        );

                    merged[path][method] = handler;
                }
            }
        }

        return merged;
    }

    /**
     * Wraps a handler so every request arriving at it has the predefined
     * Bejibun.Request accessor methods (`get`, `set`, `array`, `boolean`,
     * `float`, `integer`, `object`, `string`, plus the Laravel-inspired
     * helpers - `input`, `all`, `keys`, `only`, `except`, `has`, `hasAny`,
     * `filled`, `missing`, `header`, `hasHeader`, `bearerToken`, `cookie`,
     * `ip`, `path`, `fullUrl`, `is`, `secure`, `userAgent`, `ajax`,
     * `wantsJson`, `expectsJson`, `file`, `hasFile`, `merge`, `replace`,
     * `isMethod`, and `validate`) available - regardless of whether
     * `RequestMiddleware` (or any other middleware) was attached to the route.
     *
     * Applied as the outermost wrap around every resolved handler, so it
     * runs before any user middleware and the controller itself. The
     * payload-based accessors read `request.payload` lazily at call time,
     * so it doesn't matter that `payload` may not be populated yet when
     * this wrapper runs - only that it's populated by the time
     * `request.integer(...)` etc. is actually called (typically by
     * `RequestMiddleware`, if attached).
     */
    private attachRequestHelpers(handler: HandlerType): HandlerType {
        return async (request: Bejibun.Request, server: Bun.Server<any>) => {
            if (isEmpty(request.payload)) request.payload = {};

            /** Retrieves a header value by name (case-insensitive), with an optional fallback. */
            request.header = (key: string, defaultValue?: string): string | undefined => {
                return defineValue(request.headers.get(key), defaultValue);
            };

            /** Determines if the given header is present on the request. */
            request.hasHeader = (key: string): boolean => {
                return isNotEmpty(request.header(key));
            };

            /** Retrieves the bearer token from the `Authorization` header, if any. */
            request.bearerToken = (): string | undefined => {
                const authorization: string = defineValue(request.header("authorization"), "");

                return authorization.toLowerCase().startsWith("bearer ")
                    ? authorization.slice(7).trim()
                    : undefined;
            };

            /** Retrieves a cookie value by name. */
            request.cookie = (key: string): string | undefined => {
                return request.cookies?.get(key) ?? undefined;
            };

            /** Retrieves the `User-Agent` header value, if any. */
            request.userAgent = (): string | undefined => {
                return request.header("user-agent");
            };

            /** Retrieves the requesting client's IP address, when resolvable via the Bun server instance. */
            request.ip = (): string | undefined => {
                return server?.requestIP(request)?.address;
            };

            /** Retrieves the pathname portion of the request URL, without query string. */
            request.path = (): string => {
                return new URL(request.url).pathname;
            };

            /** Retrieves the full request URL, including query string. */
            request.fullUrl = (): string => {
                return request.url;
            };

            /** Determines if the request path matches any of the given `*`-wildcard patterns. */
            request.is = (...patterns: Array<string>): boolean => {
                const path: string = request.path().replace(/^\/+/, "");

                return patterns.some((pattern: string) => {
                    const normalized: string = pattern.replace(/^\/+/, "");
                    const regex: RegExp = new RegExp(
                        `^${normalized.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`
                    );

                    return regex.test(path);
                });
            };

            /** Determines if the request's HTTP method matches the given method, case-insensitively. */
            request.isMethod = (method: string): boolean => {
                return request.method.toLowerCase() === method.toLowerCase();
            };

            /** Determines if the request was made over HTTPS. */
            request.secure = (): boolean => {
                return new URL(request.url).protocol.toLowerCase() === "https:";
            };

            /** Determines if the request was made via `XMLHttpRequest` (`X-Requested-With` header). */
            request.ajax = (): boolean => {
                return (
                    defineValue(request.header("x-requested-with"), "").toLowerCase() ===
                    "xmlhttprequest"
                );
            };

            /** Determines if the request's `Accept` header indicates it wants a JSON response. */
            request.wantsJson = (): boolean => {
                return defineValue(request.header("accept"), "").toLowerCase().includes("json");
            };

            /** Determines if the request expects JSON - true when it's either an AJAX request or wants JSON explicitly. */
            request.expectsJson = (): boolean => {
                return defineValue(request.ajax(), request.wantsJson());
            };

            /** Retrieves every key currently present in the payload. */
            request.keys = (): Array<string> => {
                return Object.keys(request.payload);
            };

            /** Retrieves the entire payload as a key-value map. */
            request.all = (): Record<string, any> => {
                return request.payload;
            };

            /** Determines if the payload contains every one of the given keys, regardless of emptiness. */
            request.has = (keys: string | Array<string>): boolean => {
                return this.toArrayKeys(keys).every((key: string) => {
                    return Object.prototype.hasOwnProperty.call(request.payload, key);
                });
            };

            /** Determines if the payload contains at least one of the given keys. */
            request.hasAny = (keys: string | Array<string>): boolean => {
                return this.toArrayKeys(keys).some((key: string) => {
                    return Object.prototype.hasOwnProperty.call(request.payload, key);
                });
            };

            /** Determines if the given key(s) are present in the payload and not empty. */
            request.filled = (keys: string | Array<string>): boolean => {
                return this.toArrayKeys(keys).every((key: string) => isNotEmpty(request.get(key)));
            };

            /** Determines if the given key(s) are absent from the payload. */
            request.missing = (keys: string | Array<string>): boolean => {
                return this.toArrayKeys(keys).every((key: string) => {
                    return !Object.prototype.hasOwnProperty.call(request.payload, key);
                });
            };

            /** Retrieves the entire payload, or a single value with a fallback default when missing. */
            request.input = (key?: string, defaultValue?: any): any => {
                if (isEmpty(key)) return request.payload;

                const value: any = request.get(key as string);

                return isEmpty(value) ? defaultValue : value;
            };

            /** Retrieves only the given payload keys. */
            request.only = (keys: string | Array<string>): Record<string, any> => {
                const result: Record<string, any> = {};

                for (const key of this.toArrayKeys(keys)) {
                    if (Object.prototype.hasOwnProperty.call(request.payload, key))
                        result[key] = request.payload[key];
                }

                return result;
            };

            /** Retrieves the payload without the given keys. */
            request.except = (keys: string | Array<string>): Record<string, any> => {
                const excluded: Set<string> = new Set(this.toArrayKeys(keys));
                const result: Record<string, any> = {};

                for (const [key, value] of Object.entries(request.payload)) {
                    if (!excluded.has(key)) result[key] = value;
                }

                return result;
            };

            /** Merges the given values into the existing payload, leaving other keys untouched. */
            request.merge = (values: Record<string, any>): void => {
                if (isEmpty(request.payload)) request.payload = {};

                Object.assign(request.payload, values);
            };

            /** Replaces the entire payload with the given values, discarding anything previously set. */
            request.replace = (values: Record<string, any>): void => {
                request.payload = {...values};
            };

            /** Retrieves a raw value from the payload by key. */
            request.get = (key: string): any => {
                return request.payload?.[key];
            };

            /** Sets a value on the payload by key. */
            request.set = (key: string, value: any): void => {
                if (isEmpty(request.payload)) request.payload = {};

                request.payload[key] = value;
            };

            /** Retrieves a payload value coerced to an array. */
            request.array = (key: string): Array<any> => {
                const value: any = request.get(key);

                return Array.isArray(value) ? value : [value];
            };

            /** Retrieves a payload value coerced to a boolean. */
            request.boolean = (key: string): boolean => {
                const value: any = request.get(key);

                return value === true || value === "true" || value === "1" || value === 1;
            };

            /** Retrieves a payload value coerced to a floating-point number. */
            request.float = (key: string): number => {
                const value: number = parseFloat(request.get(key));

                return Number.isNaN(value) ? 0 : value;
            };

            /** Retrieves a payload value coerced to an integer. */
            request.integer = (key: string): number => {
                const value: number = parseInt(request.get(key), 10);

                return Number.isNaN(value) ? 0 : value;
            };

            /** Retrieves a payload value coerced to an object. */
            request.object = (key: string): object => {
                const value: any = request.get(key);

                return typeof value === "object" && value !== null ? value : {};
            };

            /** Retrieves a payload value coerced to a string. */
            request.string = (key: string): string => {
                const value: any = request.get(key);

                return value === undefined || value === null ? "" : String(value);
            };

            /** Retrieves an uploaded file from the payload by key. */
            request.file = (key: string): File | undefined => {
                const value: any = request.get(key);

                return value instanceof File ? value : undefined;
            };

            /** Determines if an uploaded file is present in the payload for the given key. */
            request.hasFile = (key: string): boolean => {
                return isNotEmpty(request.file(key));
            };

            /** Validates the request payload against a Vine validator, throwing `ValidatorException` (422) on failure. */
            request.validate = (validator: Bejibun.Validator): Promise<any> => {
                return validatePayload(validator, request.payload);
            };

            return handler(request, server);
        };
    }

    /**
     * Normalizes a single key or array of keys into a flat array of keys,
     * used by the payload-inspecting request helpers (`only`, `except`,
     * `has`, `hasAny`, `filled`, `missing`).
     */
    private toArrayKeys(keys: string | Array<string>): Array<string> {
        return Array.isArray(keys) ? keys : [keys];
    }

    /**
     * Joins a base path and a relative path into a single normalized,
     * leading-slash path, collapsing duplicate/trailing slashes.
     *
     * @param base - The base path (e.g. the current prefix).
     * @param path - The relative path to append.
     * @returns The joined, normalized path (e.g. `/api/users`).
     */
    private joinPaths(base: string, path: string): string {
        base = base.replace(/\/+$/, "");
        path = path.replace(/^\/+/, "");

        return `/${[base, path].filter(Boolean).join("/")}`;
    }

    /**
     * Resolves a `"Controller@method"` string definition into an actual
     * bound handler function.
     *
     * Tries a synchronous `require()` first (CommonJS/bundled controllers);
     * if that throws, falls back to a lazily-resolved dynamic `import()`
     * wrapper (for ESM-only controllers), so both module formats work
     * transparently. Also attaches `ApiDoc` metadata (via `reflect-metadata`)
     * for the resolved method, and - for websocket routes - stamps the
     * resolved controller class with the route's `path`.
     *
     * @param definition - The `"Controller@method"` string to resolve.
     * @param overrideNamespace - Namespace to resolve the controller from, if different from `this.baseNamespace`.
     * @param websocket - When set, marks this as a websocket route and carries its resolved `path`.
     * @returns The resolved, bound handler function.
     * @throws {RouterException} If the definition is malformed, the controller can't be found, or the method doesn't exist on it.
     */
    private resolveControllerString(
        definition: string,
        overrideNamespace?: string,
        websocket?: Record<string, any>
    ): HandlerType {
        const [controllerName, methodName] = definition.split("@");

        if (isEmpty(controllerName) || isEmpty(methodName)) {
            throw new RouterException(`Invalid router controller definition: ${definition}.`);
        }

        const controllerPath = App.Path.rootPath(
            defineValue(overrideNamespace, this.baseNamespace)
        );
        let location: any = null;

        try {
            location = Bun.resolveSync(`./${controllerName}.ts`, controllerPath);
        } catch {
            return async () => {
                throw new RouterException(
                    `Invalid router for controller location [${controllerPath}]`
                );
            };
        }

        let ControllerClass: any;

        try {
            ControllerClass = require(location).default;

            if (isNotEmpty(websocket)) ControllerClass.path = (websocket as any)?.path;

            this.apiDoc = Reflect.getMetadata(
                ApiDocDecoratorKey,
                ControllerClass.prototype,
                methodName
            );
        } catch {
            return async (...args: Array<any>) => {
                const module = await import(location);
                const ESMController = module.default;

                if (isNotEmpty(websocket)) ESMController.path = (websocket as any)?.path;

                this.apiDoc = Reflect.getMetadata(
                    ApiDocDecoratorKey,
                    ESMController.prototype,
                    methodName
                );

                const instance = new ESMController();

                if (typeof instance[methodName] !== "function") {
                    throw new RouterException(
                        `Method "${methodName}" not found in ${controllerName}.`
                    );
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

    /**
     * Resolves which resource actions (`index`, `store`, `show`, `update`,
     * `destroy`) should be registered by `resource()`, based on the
     * `only`/`except` options.
     *
     * @param options - Optional `only`/`except` action filters.
     * @returns The set of resource actions to register. Defaults to all five when no filter is given.
     */
    private resolveIncludedActions(options?: ResourceOptions): Set<ResourceAction> {
        const all: Array<ResourceAction> = ["index", "store", "show", "update", "destroy"];

        if (options?.only) {
            return new Set(options.only);
        }

        if (options?.except) {
            return new Set(all.filter((action) => !options.except!.includes(action)));
        }

        return new Set(all);
    }

    /**
     * Type guard: determines whether the given value is a single unresolved
     * `Route` (or array containing one) - i.e. has a `raw` property.
     *
     * @param routes - The value to check.
     * @returns True if `routes` is (or contains) a `Route` with a `raw` property.
     */
    private hasRaw(
        routes: RawsRoute | Array<RawsRoute> | Route | Array<Route> | RouterGroup
    ): routes is Route {
        if (Array.isArray(routes))
            return routes.flat().some((route) => isNotEmpty(route) && "raw" in route);

        return isNotEmpty(routes) && typeof routes === "object" && "raw" in routes;
    }

    /**
     * Type guard: determines whether the given value is an already-grouped
     * `RawsRoute` (or array containing one) - i.e. has a `raws` property.
     *
     * @param routes - The value to check.
     * @returns True if `routes` is (or contains) a `RawsRoute` with a `raws` property.
     */
    private hasRaws(
        routes: RawsRoute | Array<RawsRoute> | Route | Array<Route> | RouterGroup
    ): routes is RawsRoute {
        if (Array.isArray(routes))
            return routes.flat().some((route) => isNotEmpty(route) && "raws" in route);

        return isNotEmpty(routes) && typeof routes === "object" && "raws" in routes;
    }

    /**
     * Type guard: determines whether the given value is a `RouterMethodMap`
     * - a plain object whose every value is a handler function (e.g.
     * `{ GET: handler, POST: handler }`), as opposed to a nested `RouterGroup`.
     *
     * @param value - The value to check.
     * @returns True if every property of `value` is a function.
     */
    private isMethodMap(value: any): value is RouterMethodMap {
        return (
            isNotEmpty(value) &&
            typeof value === "object" &&
            Object.values(value).every((v: any) => typeof v === "function")
        );
    }

    /**
     * Recursively applies this builder's current prefix, middleware stack,
     * and namespace to a `RouterGroup` (or a single raw `Route`).
     *
     * For raw routes: resolves the handler, applies the effective
     * middleware chain plus `attachRequestHelpers` (unless it's a
     * websocket route), rewrites the path/namespace, and re-wraps the
     * result as `{ raws, routes }`.
     *
     * For plain nested groups: rewrites any path keys starting with `/`
     * against `this.basePath`, wraps any method maps found with the
     * middleware stack + `attachRequestHelpers`, and recurses into any
     * further nested groups.
     *
     * @param route - The route or route group to apply this builder's settings to.
     * @returns The resulting, fully-resolved route group.
     */
    private applyGroup(route: RouterGroup | Route): RouterGroup {
        if (isEmpty(route)) return route;

        if (this.hasRaw(route)) {
            const routeList: Array<Route | RouterGroup> = Array.isArray(route)
                ? route.flat()
                : [route];
            const rawRoutes: Array<Route> = routeList.filter((value: Route | RouterGroup) =>
                this.hasRaw(value)
            );
            const newRoutes: Record<string, any> = {};
            const rawGroups: Array<Route> = [];

            for (const route of rawRoutes) {
                const middlewares: Array<IMiddleware> = route.raw.middlewares.concat(
                    defineValue(this.middlewares, [])
                );
                const cleanPath: string = this.joinPaths(
                    defineValue(route.raw.prefix, this.basePath),
                    route.raw.path
                );
                const effectiveNamespace: string = route.raw.websocket
                    ? defineValue(
                          this.baseNamespace === "app/websockets" ? null : this.baseNamespace,
                          route.raw.namespace
                      )
                    : defineValue(
                          this.baseNamespace === "app/controllers" ? null : this.baseNamespace,
                          route.raw.namespace
                      );

                let resolvedHandler: HandlerType =
                    typeof route.raw.handler === "string"
                        ? this.resolveControllerString(
                              route.raw.handler,
                              effectiveNamespace,
                              route.raw.websocket
                                  ? {
                                        path: cleanPath
                                    }
                                  : undefined
                          )
                        : route.raw.handler;

                for (const middleware of [...middlewares].reverse()) {
                    resolvedHandler = middleware.handle(resolvedHandler);
                }

                if (!route.raw.websocket)
                    resolvedHandler = this.attachRequestHelpers(resolvedHandler);

                if (isEmpty(newRoutes[cleanPath])) newRoutes[cleanPath] = {};

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

        const result: RouterGroup = {};

        for (const [key, value] of Object.entries(route)) {
            const newKey = key.startsWith("/") ? this.joinPaths(this.basePath, key) : key;

            if (this.isMethodMap(value)) {
                const wrappedMethods: RouterMethodMap = {};

                for (const [method, handler] of Object.entries(value)) {
                    let resolvedHandler: HandlerType = handler;

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
