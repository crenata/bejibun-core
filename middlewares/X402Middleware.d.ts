import type { TFacilitator, TPaywall, TX402Config } from "@bejibun/x402";
import type { HandlerType } from "../types/router";
export default class X402Middleware {
    protected config?: TX402Config;
    protected facilitatorConfig?: TFacilitator;
    protected paywallConfig?: TPaywall;
    constructor(config?: TX402Config, facilitatorConfig?: TFacilitator, paywallConfig?: TPaywall);
    handle(handler: HandlerType): HandlerType;
}
