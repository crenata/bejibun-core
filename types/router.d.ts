import type {ApiDocConfig} from "../decorators/ApiDocDecorator";
import type {IMiddleware} from "../types/middleware";

export type HandlerType = (request: Bun.BunRequest, server: Bun.Server) => Promise<Response>;
export type RouterMethodMap = Record<string, HandlerType>;
export type RouterGroup = Record<string, RouterMethodMap | RouterGroup>;
export type RawRoute = {
    prefix: string;
    middlewares: Array<IMiddleware>;
    namespace: string;
    apiDoc: ApiDocConfig;
    method: string;
    path: string;
    websocket?: boolean;
    handler: string | HandlerType;
};
export type Route = {
    raw: RawRoute;
    route: RouterGroup;
};
export type RawsRoute = {
    raws: Array<Route>;
    routes: Array<RouterGroup>;
};
export type ResourceAction = "index" | "store" | "show" | "update" | "destroy";
