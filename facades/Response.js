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
    static setCustom(custom) {
        return new ResponseBuilder().setCustom(custom);
    }
    static setCookie(key, value, options) {
        return new ResponseBuilder().setCookie(key, value, options);
    }
    static setCookies(cookies) {
        return new ResponseBuilder().setCookies(cookies);
    }
    static deleteCookie(key, options) {
        return new ResponseBuilder().deleteCookie(key, options);
    }
    static deleteCookies(cookies) {
        return new ResponseBuilder().deleteCookies(cookies);
    }
}
