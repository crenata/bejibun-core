import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import type { IMiddleware } from "../types/middleware";
import type { HandlerType, ResourceAction, RouterGroup } from "../types/router";
export interface ResourceOptions {
    only?: Array<ResourceAction>;
    except?: Array<ResourceAction>;
}
export default class RouterBuilder {
    private basePath;
    private middlewares;
    private baseNamespace;
    prefix(basePath: string): RouterBuilder;
    middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    namespace(baseNamespace: string): RouterBuilder;
    group(routes: RouterGroup | Array<RouterGroup>): RouterGroup;
    resources(controller: Record<string, HandlerType>, options?: ResourceOptions): RouterGroup;
    buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): RouterGroup;
    match(methods: Array<HttpMethodEnum>, path: string, handler: string | HandlerType): RouterGroup;
    any(path: string, handler: string | HandlerType): RouterGroup;
    private joinPaths;
    private resolveControllerString;
    private resolveIncludedActions;
}
