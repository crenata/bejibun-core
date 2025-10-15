import type { IMiddleware } from "../types/middleware";
import type { HandlerType, ResourceAction, RouterGroup } from "../types/router";
import HttpMethodEnum from "../enums/HttpMethodEnum";
export interface ResourceOptions {
    only?: Array<ResourceAction>;
    except?: Array<ResourceAction>;
}
export default class RouterBuilder {
    private basePath;
    private middlewares;
    prefix(basePath: string): RouterBuilder;
    middleware(...middlewares: Array<IMiddleware>): RouterBuilder;
    group(routes: RouterGroup | Array<RouterGroup>): RouterGroup;
    resources(controller: Record<string, HandlerType>, options?: ResourceOptions): RouterGroup;
    buildSingle(method: HttpMethodEnum, path: string, handler: string | HandlerType): RouterGroup;
    private joinPaths;
    private resolveControllerString;
    private resolveIncludedActions;
}
