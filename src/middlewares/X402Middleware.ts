import type {TFacilitator, TRoutePaymentConfig} from "@bejibun/x402/types/x402";
import type {HandlerType} from "@/types/router";
import X402 from "@bejibun/x402";

export default class X402Middleware {
    protected facilitator?: TFacilitator;
    protected routePayment?: TRoutePaymentConfig;

    public constructor(facilitator?: TFacilitator, routePayment?: TRoutePaymentConfig) {
        this.facilitator = facilitator;
        this.routePayment = routePayment;
    }

    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest, server: Bun.Server<any>) => {
            return X402
                .setFacilitator(this.facilitator)
                .setRoutePayment(this.routePayment)
                .setRequest(request)
                .middleware(() => {
                    return handler(request, server);
                });
        };
    }
}