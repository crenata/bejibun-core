import ResponseBuilder from "../builders/ResponseBuilder";
export default class Response {
    static setData(data?: any): ResponseBuilder;
    static setMessage(message: string): ResponseBuilder;
    static setStatus(status: number): ResponseBuilder;
    static setCustom(custom?: Record<string, any>): ResponseBuilder;
    static setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder;
    static setCookies(cookies: Array<{
        key: string;
        value: string;
        options?: Bun.CookieInit;
    }>): ResponseBuilder;
    static deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder;
    static deleteCookies(cookies: Array<{
        key: string;
        options?: Pick<Bun.CookieInit, "domain" | "path">;
    }>): ResponseBuilder;
}
