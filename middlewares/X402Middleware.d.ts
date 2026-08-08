import type { TFacilitator, TRoutePayment } from "@bejibun/x402/types";
import type { HandlerType } from "../types/router";
export default class X402Middleware {
    protected facilitator?: TFacilitator;
    protected routePayment?: TRoutePayment;
    constructor(facilitator?: TFacilitator, routePayment?: TRoutePayment);
    handle(handler: HandlerType): HandlerType;
}
