import type {HandlerType} from "../types/router";

export type MiddlewareType = (handler: HandlerType) => HandlerType;

export interface IMiddleware {
    handle(handler: HandlerType): HandlerType;
}