import CorsLoader from "@/loader/CorsLoader";
import {isNotEmpty} from "@bejibun/utils";

export default class ResponseBuilder {
    protected data?: any;
    protected message: string;
    protected status: number;
    protected custom?: Record<string, any>;
    protected cookies: Bun.CookieMap;

    public constructor() {
        this.data = null;
        this.message = "Success";
        this.status = 200;
        this.custom = {};
        this.cookies = new Bun.CookieMap();
    }

    public setData(data?: any): ResponseBuilder {
        this.data = data;

        return this;
    }

    public setMessage(message: string): ResponseBuilder {
        this.message = message;

        return this;
    }

    public setStatus(status: number): ResponseBuilder {
        this.status = status;

        return this;
    }

    public setCustom(custom?: Record<string, any>): ResponseBuilder {
        this.custom = custom;

        return this;
    }

    public setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder {
        this.cookies.set(key, value, options);

        return this;
    }

    public setCookies(cookies: Array<{key: string, value: string, options?: Bun.CookieInit}>): ResponseBuilder {
        for (const cookie of cookies) {
            this.cookies.set(cookie.key, cookie.value, cookie.options);
        }

        return this;
    }

    public deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder {
        if (isNotEmpty(options)) this.cookies.delete(key, options as any);
        else this.cookies.delete(key);

        return this;
    }

    public deleteCookies(cookies: Array<{key: string, options?: Pick<Bun.CookieInit, "domain" | "path">}>): ResponseBuilder {
        for (const cookie of cookies) {
            if (isNotEmpty(cookie.options)) this.cookies.delete(cookie.key, cookie.options as any);
            else this.cookies.delete(cookie.key);
        }

        return this;
    }

    public send(): globalThis.Response {
        return globalThis.Response.json({
            data: this.data,
            message: this.message,
            status: this.status,
            ...this.custom
        }, {
            headers: this.applyCookies({
                ...CorsLoader.cors
            }),
            status: this.status
        });
    }

    public stream(options: ResponseInit = {}): globalThis.Response {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: this.applyCookies({
                ...CorsLoader.cors
            }),
            status: this.status
        });
    }

    private applyCookies(headers: Record<string, string>): Headers {
        const responseHeaders: Headers = new Headers(headers);

        for (const setCookieHeader of this.cookies.toSetCookieHeaders()) {
            responseHeaders.append("Set-Cookie", setCookieHeader);
        }

        return responseHeaders;
    }
}