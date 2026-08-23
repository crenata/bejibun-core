import X402 from "@bejibun/x402";
/**
 * Middleware that gates a route behind x402 payment verification, via the
 * optional `@bejibun/x402` package. Attached to a route through
 * `RouterBuilder.x402()`.
 */
export default class X402Middleware {
    /** The payment facilitator configuration used to verify/settle payments. */
    facilitator;
    /** Per-route payment requirements (price, asset, etc.). */
    routePayment;
    /**
     * @param facilitator - Optional payment facilitator configuration.
     * @param routePayment - Optional per-route payment requirements.
     */
    constructor(facilitator, routePayment) {
        this.facilitator = facilitator;
        this.routePayment = routePayment;
    }
    /**
     * Wraps the handler so the request must satisfy the configured x402
     * payment requirements before it's allowed to run.
     *
     * @param handler - The handler to protect.
     * @returns The payment-gated handler.
     */
    handle(handler) {
        return async (request, server) => {
            return X402.setFacilitator(this.facilitator)
                .setRoutePayment(this.routePayment)
                .setRequest(request)
                .middleware(() => {
                return handler(request, server);
            });
        };
    }
}
