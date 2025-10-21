import type { HandlerType } from "../types/router";
export default class MaintenanceMiddleware {
    handle(handler: HandlerType): HandlerType;
}
