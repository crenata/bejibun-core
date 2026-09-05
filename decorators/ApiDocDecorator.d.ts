import "reflect-metadata";
/**
 * Shape of the OpenAPI-flavored documentation metadata attached to a
 * controller method via `@ApiDoc(...)`.
 */
export type ApiDocConfig = {
    /** Human-readable summary of what the endpoint does. */
    description?: string;
    /** Marks the endpoint as deprecated in generated documentation. */
    deprecated?: boolean;
    /** Grouping tag(s) the endpoint is categorized under. */
    tags?: Array<string>;
    /** Describes the request shape (currently just documented parameters). */
    request?: {
        /** Header/path/query parameters accepted by the endpoint. */
        params?: Array<{
            /** Parameter name as it appears in the request (header, path, or query). */
            name: string;
            /** Location of the parameter in the request. */
            in: "header" | "path" | "query";
            /** Whether the parameter must be present. */
            required: boolean;
            schema: {
                /** Data type of the parameter value. */
                type: "string" | "number" | "integer" | "boolean" | "array" | "object";
            };
        }>;
    };
    /** Possible responses, keyed by HTTP status code. */
    response?: {
        [statusCode: number]: Array<{
            /** Human-readable description of the response. */
            description: string;
            content: {
                [contentType: string]: {
                    /** Example response payload for this content type. */
                    example: any;
                };
            };
        }>;
    };
};
/** The `reflect-metadata` key `@ApiDoc` config is stored/retrieved under. */
export declare const ApiDocDecoratorKey: string;
/**
 * Method decorator that attaches OpenAPI-flavored documentation metadata
 * to a controller method, later read back by `RouterBuilder` (via
 * `Reflect.getMetadata`) when resolving that method as a route handler,
 * and generates the app's route documentation (e.g. Swagger UI).
 *
 * @param {ApiDocConfig} config - The documentation metadata to attach.
 * @returns {any} A method decorator.
 */
declare const ApiDocDecorator: (config: ApiDocConfig) => any;
export default ApiDocDecorator;
