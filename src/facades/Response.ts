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

    public static setCustom(custom?: Record<string, any>): ResponseBuilder {
        return new ResponseBuilder().setCustom(custom);
    }

    public static setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder {
        return new ResponseBuilder().setCookie(key, value, options);
    }

    public static setCookies(cookies: Array<{key: string, value: string, options?: Bun.CookieInit}>): ResponseBuilder {
        return new ResponseBuilder().setCookies(cookies);
    }

    public static deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder {
        return new ResponseBuilder().deleteCookie(key, options);
    }

    public static deleteCookies(cookies: Array<{key: string, options?: Pick<Bun.CookieInit, "domain" | "path">}>): ResponseBuilder {
        return new ResponseBuilder().deleteCookies(cookies);
    }
}