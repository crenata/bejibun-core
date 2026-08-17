export default class ResponseBuilder {
    protected data?: any;
    protected message: string;
    protected status: number;
    protected custom?: Record<string, any>;
    protected cookies: Bun.CookieMap;
    constructor();
    setData(data?: any): ResponseBuilder;
    setMessage(message: string): ResponseBuilder;
    setStatus(status: number): ResponseBuilder;
    setCustom(custom?: Record<string, any>): ResponseBuilder;
    setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder;
    setCookies(cookies: Array<{
        key: string;
        value: string;
        options?: Bun.CookieInit;
    }>): ResponseBuilder;
    deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder;
    deleteCookies(cookies: Array<{
        key: string;
        options?: Pick<Bun.CookieInit, "domain" | "path">;
    }>): ResponseBuilder;
    send(): globalThis.Response;
    stream(options?: ResponseInit): globalThis.Response;
    private applyCookies;
}
