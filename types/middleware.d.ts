import type {HandlerType} from "../types/router";

/** A function that wraps a handler with additional behavior, returning a new handler. */
export type MiddlewareType = (handler: HandlerType) => HandlerType;

/**
 * Contract every Bejibun middleware class implements. `RouterBuilder`
 * calls `handle()` on each middleware (in reverse order) to progressively
 * wrap a route's resolved handler.
 */
export interface IMiddleware {
    /**
     * Wraps the given handler with this middleware's behavior.
     *
     * @param handler - The handler to wrap.
     * @returns The wrapped handler.
     */
    handle(handler: HandlerType): HandlerType;
}
