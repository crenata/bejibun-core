import type {HandlerType} from "@bejibun/core/types";

/**
 * Example middleware stub. Wraps the next handler with custom behavior,
 * to be implemented in the `handle()` body.
 */
export default class TemplateMiddleware {
    /**
     * Wraps the given handler with this middleware's behavior.
     *
     * @param {HandlerType} handler - The handler to wrap.
     * @returns {HandlerType} The wrapped handler.
     */
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bejibun.Request) => {
            // Your code goes here

            return handler(request);
        };
    }
}
