import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import RateLimiterException from "../exceptions/RateLimiterException";
import RouterInvalidException from "../exceptions/RouterInvalidException";
import RuntimeException from "../exceptions/RuntimeException";
import ValidatorException from "../exceptions/ValidatorException";
export default class ExceptionHandler {
    handle(error: Bun.ErrorLike | ModelNotFoundException | RateLimiterException | RouterInvalidException | RuntimeException | ValidatorException | ValidationError): globalThis.Response;
    route(request: Bun.BunRequest): globalThis.Response;
}
