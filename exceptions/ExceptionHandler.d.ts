import RateLimiterException from "@bejibun/limiter/exceptions/RateLimiterException";
import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import QueueException from "../exceptions/QueueException";
import RouterException from "../exceptions/RouterException";
import RuntimeException from "../exceptions/RuntimeException";
import ValidatorException from "../exceptions/ValidatorException";
export default class ExceptionHandler {
    handle(error: Bun.ErrorLike | ModelNotFoundException | QueueException | RateLimiterException | RouterException | RuntimeException | ValidatorException | ValidationError): globalThis.Response;
    publicRoute(request: BejibunRequest): Promise<globalThis.Response>;
}
