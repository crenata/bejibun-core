import ResponseBuilder from "../builders/ResponseBuilder";
export default class Response {
    static setData(data?: any): ResponseBuilder;
    static setMessage(message: string): ResponseBuilder;
    static setStatus(status: number): ResponseBuilder;
}
