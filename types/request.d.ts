/**
 * Extended Bun request object used throughout the Bejibun framework,
 * providing convenient typed access to request payload data.
 */
export type BejibunRequest<Path extends string = string> = Bun.BunRequest<Path> & {
    /**
     * The parsed request payload, combining query params, route params,
     * and/or body data into a single key-value map.
     */
    payload: Record<string, any>;

    /**
     * Retrieves a header value by name (case-insensitive).
     *
     * @param key - The header name to look up.
     * @param defaultValue - The value to return if the header is not set.
     * @returns The header value, or defaultValue if not present.
     */
    header: (key: string, defaultValue?: string) => string | undefined;

    /**
     * Determines if the given header is present on the request.
     *
     * @param key - The header name to check for.
     * @returns True if the header is present.
     */
    hasHeader: (key: string) => boolean;

    /**
     * Retrieves the bearer token from the `Authorization` header, if any.
     *
     * @returns The bearer token, or undefined if not present.
     */
    bearerToken: () => string | undefined;

    /**
     * Retrieves a cookie value by name.
     *
     * @param key - The cookie name to look up.
     * @returns The cookie value, or undefined if not present.
     */
    cookie: (key: string) => string | undefined;

    /**
     * Retrieves the `User-Agent` header value, if any.
     *
     * @returns The client's user agent, or undefined if not present.
     */
    userAgent: () => string | undefined;

    /**
     * Retrieves the requesting client's IP address, when resolvable.
     *
     * @returns The client IP address, or undefined if it can't be resolved.
     */
    ip: () => string | undefined;

    /**
     * Retrieves the pathname portion of the request URL, without query string.
     *
     * @returns The request path.
     */
    path: () => string;

    /**
     * Retrieves the full request URL, including query string.
     *
     * @returns The full request URL.
     */
    fullUrl: () => string;

    /**
     * Determines if the request path matches any of the given patterns.
     * Patterns support `*` as a wildcard, e.g. `admin/*`.
     *
     * @param patterns - One or more path patterns to match against.
     * @returns True if the request path matches any pattern.
     */
    is: (...patterns: Array<string>) => boolean;

    /**
     * Determines if the request's HTTP method matches the given method,
     * case-insensitively.
     *
     * @param method - The HTTP method to compare against (e.g. `"post"`).
     * @returns True if the request method matches.
     */
    isMethod: (method: string) => boolean;

    /**
     * Determines if the request was made over HTTPS.
     *
     * @returns True if the request is secure.
     */
    secure: () => boolean;

    /**
     * Determines if the request was made via `XMLHttpRequest`
     * (based on the `X-Requested-With` header).
     *
     * @returns True if the request is an AJAX request.
     */
    ajax: () => boolean;

    /**
     * Determines if the request explicitly wants a JSON response,
     * based on its `Accept` header.
     *
     * @returns True if the request's `Accept` header indicates JSON.
     */
    wantsJson: () => boolean;

    /**
     * Determines if the request expects a JSON response - true when the
     * request is either an AJAX request or explicitly wants JSON.
     *
     * @returns True if the request expects JSON.
     */
    expectsJson: () => boolean;

    /**
     * Retrieves every key currently present in the payload.
     *
     * @returns The payload keys.
     */
    keys: () => Array<string>;

    /**
     * Retrieves the entire payload as a key-value map.
     *
     * @returns The full payload.
     */
    all: () => Record<string, any>;

    /**
     * Determines if the payload contains every one of the given keys,
     * regardless of whether their values are empty.
     *
     * @param keys - The payload key(s) to check for.
     * @returns True if all given keys are present.
     */
    has: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the payload contains at least one of the given keys.
     *
     * @param keys - The payload key(s) to check for.
     * @returns True if any of the given keys are present.
     */
    hasAny: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the given key(s) are present in the payload and not empty.
     *
     * @param keys - The payload key(s) to check.
     * @returns True if all given keys are present and non-empty.
     */
    filled: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the given key(s) are absent from the payload.
     *
     * @param keys - The payload key(s) to check.
     * @returns True if all given keys are missing.
     */
    missing: (keys: string | Array<string>) => boolean;

    /**
     * Retrieves the entire payload, or a single value with a fallback
     * default when it's missing - mirrors Laravel's `Request::input()`.
     *
     * @param key - The payload key to look up. Omit to retrieve the entire payload.
     * @param defaultValue - The value to return if the key is not present.
     * @returns The entire payload, or the resolved value for the given key.
     */
    input: (key?: string, defaultValue?: any) => any;

    /**
     * Retrieves only the given payload keys.
     *
     * @param keys - The payload key(s) to keep.
     * @returns A subset of the payload containing only the given keys.
     */
    only: (keys: string | Array<string>) => Record<string, any>;

    /**
     * Retrieves the payload without the given keys.
     *
     * @param keys - The payload key(s) to exclude.
     * @returns A subset of the payload excluding the given keys.
     */
    except: (keys: string | Array<string>) => Record<string, any>;

    /**
     * Replaces the given keys in the payload with new values, leaving
     * every other existing key untouched - mirrors Laravel's `Request::merge()`.
     *
     * @param values - A key-value map to merge into the payload.
     */
    merge: (values: Record<string, any>) => void;

    /**
     * Replaces the entire payload with the given values, discarding
     * anything previously set - mirrors Laravel's `Request::replace()`.
     *
     * @param values - The key-value map to replace the payload with.
     */
    replace: (values: Record<string, any>) => void;

    /**
     * Retrieves a raw value from the payload by key.
     *
     * @param key - The payload key to look up.
     * @returns The value associated with the key, or undefined if not present.
     */
    get: (key: string) => any;

    /**
     * Sets a value on the payload by key.
     *
     * @param key - The payload key to set.
     * @param value - The value to assign to the key.
     */
    set: (key: string, value: any) => void;

    /**
     * Retrieves a payload value coerced to an array.
     *
     * @param key - The payload key to look up.
     * @returns The value as an array.
     */
    array: (key: string) => Array<any>;

    /**
     * Retrieves a payload value coerced to a boolean.
     *
     * @param key - The payload key to look up.
     * @returns The value as a boolean.
     */
    boolean: (key: string) => boolean;

    /**
     * Retrieves a payload value coerced to a floating-point number.
     *
     * @param key - The payload key to look up.
     * @returns The value as a float.
     */
    float: (key: string) => number;

    /**
     * Retrieves a payload value coerced to an integer.
     *
     * @param key - The payload key to look up.
     * @returns The value as an integer.
     */
    integer: (key: string) => number;

    /**
     * Retrieves a payload value coerced to an object.
     *
     * @param key - The payload key to look up.
     * @returns The value as an object.
     */
    object: (key: string) => object;

    /**
     * Retrieves a payload value coerced to a string.
     *
     * @param key - The payload key to look up.
     * @returns The value as a string.
     */
    string: (key: string) => string;

    /**
     * Retrieves an uploaded file from the payload by key.
     *
     * @param key - The payload key to look up.
     * @returns The uploaded File, or undefined if not present.
     */
    file: (key: string) => File | undefined;

    /**
     * Determines if an uploaded file is present in the payload for the given key.
     *
     * @param key - The payload key to check.
     * @returns True if a file is present for the given key.
     */
    hasFile: (key: string) => boolean;

    /**
     * Validates the request payload against a Vine validator - mirrors
     * Laravel's `Request::validate()`. Throws a `ValidatorException`
     * (422) when validation fails.
     *
     * @param validator - The Vine validator to run against the payload.
     * @returns The validated (and type-coerced) data.
     */
    validate: (validator: Bejibun.Validator) => Promise<any>;
};
