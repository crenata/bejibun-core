import X402 from "@bejibun/x402";
export default class X402Middleware {
    facilitator;
    routePayment;
    constructor(facilitator, routePayment) {
        this.facilitator = facilitator;
        this.routePayment = routePayment;
    }
    handle(handler) {
        return async (request, server) => {
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
