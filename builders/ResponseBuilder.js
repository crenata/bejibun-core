import CorsLoader from "../loader/CorsLoader";
import { isNotEmpty } from "@bejibun/utils";
export default class ResponseBuilder {
    data;
    message;
    status;
    custom;
    cookies;
    constructor() {
        this.data = null;
        this.message = "Success";
        this.status = 200;
        this.custom = {};
        this.cookies = new Bun.CookieMap();
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setMessage(message) {
        this.message = message;
        return this;
    }
    setStatus(status) {
        this.status = status;
        return this;
    }
    setCustom(custom) {
        this.custom = custom;
        return this;
    }
    setCookie(key, value, options) {
        this.cookies.set(key, value, options);
        return this;
    }
    setCookies(cookies) {
        for (const cookie of cookies) {
            this.cookies.set(cookie.key, cookie.value, cookie.options);
        }
        return this;
    }
    deleteCookie(key, options) {
        if (isNotEmpty(options))
            this.cookies.delete(key, options);
        else
            this.cookies.delete(key);
        return this;
    }
    deleteCookies(cookies) {
        for (const cookie of cookies) {
            if (isNotEmpty(cookie.options))
                this.cookies.delete(cookie.key, cookie.options);
            else
                this.cookies.delete(cookie.key);
        }
        return this;
    }
    send() {
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
    stream(options = {}) {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: this.applyCookies({
                ...CorsLoader.cors
            }),
            status: this.status
        });
    }
    applyCookies(headers) {
        const responseHeaders = new Headers(headers);
        for (const setCookieHeader of this.cookies.toSetCookieHeaders()) {
            responseHeaders.append("Set-Cookie", setCookieHeader);
        }
        return responseHeaders;
    }
}
