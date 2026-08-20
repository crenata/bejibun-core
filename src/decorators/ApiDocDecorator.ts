import "reflect-metadata";

export type ApiDocConfig = {
    description?: string;
    deprecated?: boolean;
    tags?: Array<string>;
    request?: {
        params?: Array<{
            name: string;
            in: "header" | "path" | "query";
            required: boolean;
            schema: {
                type: "string" | "number" | "integer" | "boolean" | "array" | "object";
            };
        }>;
    };
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

export const ApiDocDecoratorKey: string = "api:doc";

const ApiDocDecorator = (config: ApiDocConfig): any => {
    return (target: any, propertyKey: string): void => {
        Reflect.defineMetadata(ApiDocDecoratorKey, config, target, propertyKey);
    };
};

export default ApiDocDecorator;
