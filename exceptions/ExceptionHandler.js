import App from "@bejibun/app";
import RateLimiterException from "@bejibun/limiter/exceptions/RateLimiterException";
import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
import HttpMethodEnum from "@bejibun/utils/enums/HttpMethodEnum";
import { ValidationError } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import QueueException from "../exceptions/QueueException";
import RouterException from "../exceptions/RouterException";
import RuntimeException from "../exceptions/RuntimeException";
import ValidatorException from "../exceptions/ValidatorException";
import Response from "../facades/Response";
/**
 * Central exception-to-response translator. Converts thrown errors into
 * consistent JSON error responses (message + status code), and serves
 * fallback static files (or a 404/204) for unmatched public routes.
 * Also logs every handled error via `Logger`.
 */
export default class ExceptionHandler {
    /**
     * Converts a thrown error into a JSON `Response`.
     *
     * Recognized framework/library exceptions (`ModelNotFoundException`,
     * `QueueException`, `RateLimiterException`, `RouterException`,
     * `RuntimeException`, `ValidatorException`) use their own `message`
     * and `code` as the response body/status. Objection `ValidationError`
     * uses its own `message`/`statusCode`. Anything else falls back to a
     * generic `500 Internal server error.` response.
     *
     * @param error - The thrown error to handle.
     * @returns The resulting JSON error response.
     */
    handle(error) {
        Logger.setContext("APP").error(error.message).trace(error.stack);
        if (error instanceof ModelNotFoundException ||
            error instanceof QueueException ||
            error instanceof RateLimiterException ||
            error instanceof RouterException ||
            error instanceof RuntimeException ||
            error instanceof ValidatorException)
            return Response.setMessage(error.message).setStatus(error.code).send();
        if (error instanceof ValidationError)
            return Response.setMessage(error.message).setStatus(error.statusCode).send();
        return Response.setMessage(defineValue(error.message, "Internal server error."))
            .setStatus(500)
            .send();
    }
    /**
     * Fallback handler for requests that didn't match any registered
     * route. Attempts to serve a matching static file from the public
     * directory; if none exists, returns a `204` (for `OPTIONS`
     * requests) or `404` JSON response.
     *
     * @param request - The unmatched incoming request.
     * @returns The static file response, or a 204/404 fallback.
     */
    async publicRoute(request) {
        const url = new URL(request.url);
        const file = Bun.file(App.Path.publicPath(url.pathname.replace(/^\//, "")));
        if (await file.exists())
            return new globalThis.Response(file);
        return Response.setMessage("What are you looking for doesn't exists.")
            .setStatus(request.method === HttpMethodEnum.Options ? 204 : 404)
            .send();
    }
}
