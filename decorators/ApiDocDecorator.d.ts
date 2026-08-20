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
export declare const ApiDocDecoratorKey: string;
declare const ApiDocDecorator: (config: ApiDocConfig) => any;
export default ApiDocDecorator;
