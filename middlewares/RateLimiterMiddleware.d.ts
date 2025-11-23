import type { HandlerType } from "../types/router";
export default class RateLimiterMiddleware {
    handle(handler: HandlerType): HandlerType;
}
