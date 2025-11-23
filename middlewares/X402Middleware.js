import X402 from "@bejibun/x402";
export default class X402Middleware {
    config;
    facilitatorConfig;
    paywallConfig;
    constructor(config, facilitatorConfig, paywallConfig) {
        this.config = config;
        this.facilitatorConfig = facilitatorConfig;
        this.paywallConfig = paywallConfig;
    }
    handle(handler) {
        return async (request, server) => {
            return X402
                .setConfig(this.config)
                .setFacilitator(this.facilitatorConfig)
                .setPaywall(this.paywallConfig)
                .setRequest(request)
                .middleware(() => {
                return handler(request, server);
            });
        };
    }
}
