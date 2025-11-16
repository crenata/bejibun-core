import type {TFacilitator, TPaywall, TX402Config} from "@bejibun/x402";
import type {HandlerType} from "@/types/router";
import X402 from "@bejibun/x402";

export default class X402Middleware {
    protected config?: TX402Config;
    protected facilitatorConfig?: TFacilitator;
    protected paywallConfig?: TPaywall;

    public constructor(config?: TX402Config, facilitatorConfig?: TFacilitator, paywallConfig?: TPaywall) {
        this.config = config;
        this.facilitatorConfig = facilitatorConfig;
        this.paywallConfig = paywallConfig;
    }

    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest) => {
            return X402
                .setConfig(this.config)
                .setFacilitator(this.facilitatorConfig)
                .setPaywall(this.paywallConfig)
                .setRequest(request)
                .middleware(() => {
                    return handler(request);
                });
        };
    }
}