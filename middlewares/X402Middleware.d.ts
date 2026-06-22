import type { TFacilitator, TRoutePaymentConfig } from "@bejibun/x402/types/x402";
import type { HandlerType } from "../types/router";
export default class X402Middleware {
    protected facilitator?: TFacilitator;
    protected routePayment?: TRoutePaymentConfig;
    constructor(facilitator?: TFacilitator, routePayment?: TRoutePaymentConfig);
    handle(handler: HandlerType): HandlerType;
}
