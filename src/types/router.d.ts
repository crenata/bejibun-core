import {IMiddleware} from "@/types/middleware";

export type HandlerType = (request: Bun.BunRequest, server: Bun.Server) => Promise<Response>;
export type RouterGroup = Record<string, Record<string, HandlerType>>;
export type RawRoute = {
    prefix: string,
    middlewares: Array<IMiddleware>,
    namespace: string,
    method: string,
    path: string,
    handler: string | HandlerType
};
export type Route = {
    raw: RawRoute,
    route: RouterGroup
};
export type ResourceAction = "index" | "store" | "show" | "update" | "destroy";