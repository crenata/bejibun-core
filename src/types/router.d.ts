import {IMiddleware} from "@/types/middleware";
import {VineValidator} from "@vinejs/vine";

export type HandlerType = (request: Bun.BunRequest, server: Bun.Server) => Promise<Response>;
export type RouterMethodMap = Record<string, HandlerType>;
export type RouterGroup = Record<string, RouterMethodMap | RouterGroup>;
export type RawRoute = {
    prefix: string;
    middlewares: Array<IMiddleware>;
    namespace: string;
    documentation: RouterDocs;
    method: string;
    path: string;
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
export type RouterDocs = {
    description: string | null | undefined;
    request: {
        params: VineValidator<any, any> | null | undefined;
    };
};
export type ResourceAction = "index" | "store" | "show" | "update" | "destroy";