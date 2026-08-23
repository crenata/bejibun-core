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
            name: string;

            in: "header" | "path" | "query";

            required: boolean;

            schema: {
                type: "string" | "number" | "integer" | "boolean" | "array" | "object";
            };
        }>;
    };
    /** Possible responses, keyed by HTTP status code. */
    response?: {
        [statusCode: number]: Array<{
            description: string;

            content: {
                [contentType: string]: {
                    example: any;
                };
            };
        }>;
    };
};

/** The `reflect-metadata` key `@ApiDoc` config is stored/retrieved under. */
export const ApiDocDecoratorKey: string = "api:doc";

/**
 * Method decorator that attaches OpenAPI-flavored documentation metadata
 * to a controller method, later read back by `RouterBuilder` (via
 * `Reflect.getMetadata`) when resolving that method as a route handler,
 * and used to generate the app's route documentation (e.g. Swagger UI).
 *
 * @param config - The documentation metadata to attach.
 * @returns A method decorator.
 */
const ApiDocDecorator = (config: ApiDocConfig): any => {
    return (target: any, propertyKey: string): void => {
        Reflect.defineMetadata(ApiDocDecoratorKey, config, target, propertyKey);
    };
};

export default ApiDocDecorator;
