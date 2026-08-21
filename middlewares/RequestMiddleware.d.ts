import type { HandlerType } from "../types/router";
export default class RequestMiddleware {
    handle(handler: HandlerType): HandlerType;
}
