import ResponseBuilder from "../builders/ResponseBuilder";
/**
 * Static facade over `ResponseBuilder`, giving controllers a fluent,
 * Laravel-style entry point for building HTTP responses (e.g.
 * `Response.setData(payload).setStatus(201).send()`) without needing to
 * instantiate the builder themselves.
 */
export default class Response {
    /**
     * Starts a new response with the given data payload.
     *
     * @param data - The response body data.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setData(data?: any): ResponseBuilder;
    /**
     * Starts a new response with the given message.
     *
     * @param message - The response message.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setMessage(message: string): ResponseBuilder;
    /**
     * Starts a new response with the given HTTP status code.
     *
     * @param status - The HTTP status code.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setStatus(status: number): ResponseBuilder;
    /**
     * Starts a new response with additional custom top-level fields.
     *
     * @param custom - Extra fields to merge into the response body.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setCustom(custom?: Record<string, any>): ResponseBuilder;
    /**
     * Starts a new response that sets a single cookie.
     *
     * @param key - The cookie name.
     * @param value - The cookie value.
     * @param options - Optional cookie attributes (domain, path, expiry, etc.).
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder;
    /**
     * Starts a new response that sets multiple cookies at once.
     *
     * @param cookies - The cookies to set.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static setCookies(cookies: Array<{
        key: string;
        value: string;
        options?: Bun.CookieInit;
    }>): ResponseBuilder;
    /**
     * Starts a new response that deletes a single cookie.
     *
     * @param key - The cookie name to delete.
     * @param options - Optional `domain`/`path` to scope the deletion.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder;
    /**
     * Starts a new response that deletes multiple cookies at once.
     *
     * @param cookies - The cookies to delete.
     * @returns A new `ResponseBuilder` for further chaining.
     */
    static deleteCookies(cookies: Array<{
        key: string;
        options?: Pick<Bun.CookieInit, "domain" | "path">;
    }>): ResponseBuilder;
}
