import "reflect-metadata";
export type ApiDocConfig = {
    description?: string;
    tags?: Array<string>;
    request?: {
        params?: Array<{
            name: string;
            in: "header" | "path" | "query";
            required: boolean;
            schema: {
                type: "string";
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
declare const ApiDocDecorator: (config: ApiDocConfig) => Function;
export default ApiDocDecorator;
