/**
 * Fluent builder used to construct HTTP responses. Wraps `data`,
 * `message`, `status`, and any custom top-level fields into a consistent
 * JSON envelope, applies CORS headers, and manages response cookies via
 * Bun's `CookieMap`. This is what the `Response` facade delegates to.
 */
export default class ResponseBuilder {
    /** The `data` payload included in the response body. */
    protected data?: any;
    /** The `message` field included in the response body. */
    protected message: string;
    /** The HTTP status code for the response. */
    protected status: number;
    /** Additional top-level fields merged into the response body. */
    protected custom?: Record<string, any>;
    /** Cookies to be set on the outgoing response. */
    protected cookies: Bun.CookieMap;
    constructor();
    /**
     * Sets the response body's `data` field.
     *
     * @param data - The data to include in the response.
     * @returns This builder, for chaining.
     */
    setData(data?: any): ResponseBuilder;
    /**
     * Sets the response body's `message` field.
     *
     * @param message - The message to include in the response.
     * @returns This builder, for chaining.
     */
    setMessage(message: string): ResponseBuilder;
    /**
     * Sets the HTTP status code for the response.
     *
     * @param status - The HTTP status code.
     * @returns This builder, for chaining.
     */
    setStatus(status: number): ResponseBuilder;
    /**
     * Sets additional top-level fields to merge into the response body,
     * alongside `data` and `message`.
     *
     * @param custom - The additional fields to include.
     * @returns This builder, for chaining.
     */
    setCustom(custom?: Record<string, any>): ResponseBuilder;
    /**
     * Queues a single cookie to be set on the outgoing response.
     *
     * @param key - The cookie name.
     * @param value - The cookie value.
     * @param options - Optional cookie attributes (domain, path, expiry, etc.).
     * @returns This builder, for chaining.
     */
    setCookie(key: string, value: string, options?: Bun.CookieInit): ResponseBuilder;
    /**
     * Queues multiple cookies to be set on the outgoing response.
     *
     * @param cookies - The cookies to set, each with a key, value, and optional attributes.
     * @returns This builder, for chaining.
     */
    setCookies(cookies: Array<{
        key: string;
        value: string;
        options?: Bun.CookieInit;
    }>): ResponseBuilder;
    /**
     * Queues a single cookie to be deleted (expired) on the outgoing response.
     *
     * @param key - The cookie name to delete.
     * @param options - Optional `domain`/`path` to scope the deletion to.
     * @returns This builder, for chaining.
     */
    deleteCookie(key: string, options?: Pick<Bun.CookieInit, "domain" | "path">): ResponseBuilder;
    /**
     * Queues multiple cookies to be deleted (expired) on the outgoing response.
     *
     * @param cookies - The cookies to delete, each with a key and optional `domain`/`path` scoping.
     * @returns This builder, for chaining.
     */
    deleteCookies(cookies: Array<{
        key: string;
        options?: Pick<Bun.CookieInit, "domain" | "path">;
    }>): ResponseBuilder;
    /**
     * Builds and returns the final JSON HTTP response, combining `data`,
     * `message`, `status`, and any custom fields into the response body,
     * with CORS headers and any queued cookies applied.
     *
     * @returns The built `Response` object.
     */
    send(): globalThis.Response;
    /**
     * Builds and returns a streamed file response (using the value
     * previously set via `setData()` as the file path), with CORS headers
     * and any queued cookies applied.
     *
     * @param options - Additional `ResponseInit` options to merge in.
     * @returns The built streaming `Response` object.
     */
    stream(options?: ResponseInit): globalThis.Response;
    /**
     * Appends every queued cookie (sets and deletions) as `Set-Cookie`
     * headers onto the given base headers.
     *
     * @param headers - The base headers to extend.
     * @returns A `Headers` instance including the base headers plus every queued cookie.
     */
    private applyCookies;
}
