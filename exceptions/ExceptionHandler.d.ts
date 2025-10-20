import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import ValidatorException from "../exceptions/ValidatorException";
export default class ExceptionHandler {
    handle(error: Bun.ErrorLike | ModelNotFoundException | ValidatorException | ValidationError): globalThis.Response;
    route(request: Bun.BunRequest): globalThis.Response;
}
