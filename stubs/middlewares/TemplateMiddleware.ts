import type {HandlerType} from "@bejibun/core/types";

export default class TemplateMiddleware {
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest) => {
            // Your code goes here

            return handler(request);
        };
    }
}