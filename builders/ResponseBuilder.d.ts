export default class ResponseBuilder {
    protected data?: any;
    protected message: string;
    protected status: number;
    protected custom?: Record<string, any>;
    constructor();
    setData(data?: any): ResponseBuilder;
    setMessage(message: string): ResponseBuilder;
    setStatus(status: number): ResponseBuilder;
    setCustom(custom?: Record<string, any>): ResponseBuilder;
    send(): globalThis.Response;
    stream(options?: ResponseInit): globalThis.Response;
}
