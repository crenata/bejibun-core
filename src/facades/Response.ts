import ResponseBuilder from "@/builders/ResponseBuilder";

export default class Response {
    public static setData(data?: any): ResponseBuilder {
        return new ResponseBuilder().setData(data);
    }

    public static setMessage(message: string): ResponseBuilder {
        return new ResponseBuilder().setMessage(message);
    }

    public static setStatus(status: number): ResponseBuilder {
        return new ResponseBuilder().setStatus(status);
    }
}