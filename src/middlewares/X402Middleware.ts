import type {TFacilitator, TRoutePayment} from "@bejibun/x402/types";
import type {HandlerType} from "@/types/router";
import X402 from "@bejibun/x402";

export default class X402Middleware {
    protected facilitator?: TFacilitator;
    protected routePayment?: TRoutePayment;

    public constructor(facilitator?: TFacilitator, routePayment?: TRoutePayment) {
        this.facilitator = facilitator;
        this.routePayment = routePayment;
    }

    public handle(handler: HandlerType): HandlerType {
        return async (request: BejibunRequest, server: Bun.Server<any>) => {
            return X402.setFacilitator(this.facilitator)
                .setRoutePayment(this.routePayment)
                .setRequest(request)
                .middleware(() => {
                    return handler(request, server);
                });
        };
    }
}
