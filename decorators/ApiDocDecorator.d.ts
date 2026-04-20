import "reflect-metadata";
export type ApiDocConfig = {
    description: string | null | undefined;
    request: {
        params: {
            name: string;
            in: "header" | "path" | "query";
            required: boolean;
            schema: {
                type: "string";
            };
        }[];
    } | null | undefined;
    response: {
        [statusCode: number]: {
            description: string;
            content: {
                [contentType: string]: {
                    example: any;
                };
            };
        }[];
    } | null | undefined;
};
export declare const ApiDocDecoratorKey: string;
declare const ApiDocDecorator: (config: ApiDocConfig) => Function;
export default ApiDocDecorator;
