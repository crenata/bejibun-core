import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import RateLimiterException from "../exceptions/RateLimiterException";
import RouterException from "../exceptions/RouterException";
import RuntimeException from "../exceptions/RuntimeException";
import ValidatorException from "../exceptions/ValidatorException";
import Response from "../facades/Response";
export default class ExceptionHandler {
    handle(error) {
        Logger.setContext("APP").error(error.message).trace(error.stack);
        if (error instanceof ModelNotFoundException ||
            error instanceof RateLimiterException ||
            error instanceof RouterException ||
            error instanceof RuntimeException ||
            error instanceof ValidatorException)
            return Response
                .setMessage(error.message)
                .setStatus(error.code)
                .send();
        if (error instanceof ValidationError)
            return Response
                .setMessage(error.message)
                .setStatus(error.statusCode)
                .send();
        return Response
            .setMessage(defineValue(error.message, "Internal server error."))
            .setStatus(500)
            .send();
    }
    route(request) {
        return Response
            .setMessage("What are you looking for doesn't exists.")
            .setStatus(request.method === HttpMethodEnum.Options ? 204 : 404)
            .send();
    }
}
