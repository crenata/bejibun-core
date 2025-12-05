import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import RateLimiterException from "../exceptions/RateLimiterException";
import RouterException from "../exceptions/RouterException";
import RuntimeException from "../exceptions/RuntimeException";
import ValidatorException from "../exceptions/ValidatorException";
export default class ExceptionHandler {
    handle(error: Bun.ErrorLike | ModelNotFoundException | RateLimiterException | RouterException | RuntimeException | ValidatorException | ValidationError): globalThis.Response;
    route(request: Bun.BunRequest): globalThis.Response;
}
