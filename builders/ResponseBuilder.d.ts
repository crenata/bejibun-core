export default class ResponseBuilder {
    protected data?: any;
    protected message: string;
    protected status: number;
    constructor();
    setData(data?: any): ResponseBuilder;
    setMessage(message: string): ResponseBuilder;
    setStatus(status: number): ResponseBuilder;
    send(): globalThis.Response;
    stream(options?: ResponseInit): globalThis.Response;
}
