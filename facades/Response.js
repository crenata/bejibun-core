import ResponseBuilder from "../builders/ResponseBuilder";
export default class Response {
    static setData(data) {
        return new ResponseBuilder().setData(data);
    }
    static setMessage(message) {
        return new ResponseBuilder().setMessage(message);
    }
    static setStatus(status) {
        return new ResponseBuilder().setStatus(status);
    }
}
