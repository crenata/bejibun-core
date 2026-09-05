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
     * @param {string} key - The header name to look up.
     * @param {string} defaultValue - The value to return if the header is not set.
     * @returns {string|undefined} The header value, or defaultValue if not present.
     */
    header: (key: string, defaultValue?: string) => string | undefined;

    /**
     * Determines if the given header is present on the request.
     *
     * @param {string} key - The header name to check for.
     * @returns {boolean} True if the header is present.
     */
    hasHeader: (key: string) => boolean;

    /**
     * Retrieves the bearer token from the `Authorization` header, if any.
     *
     * @returns {string|undefined} The bearer token, or undefined if not present.
     */
    bearerToken: () => string | undefined;

    /**
     * Retrieves a cookie value by name.
     *
     * @param {string} key - The cookie name to look up.
     * @returns {string|undefined} The cookie value, or undefined if not present.
     */
    cookie: (key: string) => string | undefined;

    /**
     * Retrieves the `User-Agent` header value, if any.
     *
     * @returns {string|undefined} The client's user agent, or undefined if not present.
     */
    userAgent: () => string | undefined;

    /**
     * Retrieves the requesting client's IP address, when resolvable.
     *
     * @returns {string|undefined} The client IP address, or undefined if it can't be resolved.
     */
    ip: () => string | undefined;

    /**
     * Retrieves the pathname portion of the request URL, without query string.
     *
     * @returns {string} The request path.
     */
    path: () => string;

    /**
     * Retrieves the full request URL, including query string.
     *
     * @returns {string} The full request URL.
     */
    fullUrl: () => string;

    /**
     * Determines if the request path matches any of the given patterns.
     * Patterns support `*` as a wildcard, e.g. `admin/*`.
     *
     * @param {Array<string>} patterns - One or more path patterns to match against.
     * @returns {boolean} True if the request path matches any pattern.
     */
    is: (...patterns: Array<string>) => boolean;

    /**
     * Determines if the request's HTTP method matches the given method,
     * case-insensitively.
     *
     * @param {string} method - The HTTP method to compare against (e.g. `"post"`).
     * @returns {boolean} True if the request method matches.
     */
    isMethod: (method: string) => boolean;

    /**
     * Determines if the request is served over HTTPS.
     *
     * @returns {boolean} True if the request is secure.
     */
    secure: () => boolean;

    /**
     * Determines if the request is initiated via `XMLHttpRequest`
     * (based on the `X-Requested-With` header).
     *
     * @returns {boolean} True if the request is an AJAX request.
     */
    ajax: () => boolean;

    /**
     * Determines if the request explicitly wants a JSON response,
     * based on its `Accept` header.
     *
     * @returns {boolean} True if the request's `Accept` header indicates JSON.
     */
    wantsJson: () => boolean;

    /**
     * Determines if the request expects a JSON response - true when the
     * request is either an AJAX request or explicitly wants JSON.
     *
     * @returns {boolean} True if the request expects JSON.
     */
    expectsJson: () => boolean;

    /**
     * Retrieves every key currently present in the payload.
     *
     * @returns {Array<string>} The payload keys.
     */
    keys: () => Array<string>;

    /**
     * Retrieves the entire payload as a key-value map.
     *
     * @returns {Record<string, any>} The full payload.
     */
    all: () => Record<string, any>;

    /**
     * Determines if the payload contains every one of the given keys,
     * regardless of whether their values are empty.
     *
     * @param {string|Array<string>} keys - The payload key(s) to check for.
     * @returns {boolean} True if all given keys are present.
     */
    has: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the payload contains at least one of the given keys.
     *
     * @param {string|Array<string>} keys - The payload key(s) to check for.
     * @returns {boolean} True if any of the given keys are present.
     */
    hasAny: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the given key(s) are present in the payload and not empty.
     *
     * @param {string|Array<string>} keys - The payload key(s) to check.
     * @returns {boolean} True if all given keys are present and non-empty.
     */
    filled: (keys: string | Array<string>) => boolean;

    /**
     * Determines if the given key(s) are absent from the payload.
     *
     * @param {string|Array<string>} keys - The payload key(s) to check.
     * @returns {boolean} True if all given keys are missing.
     */
    missing: (keys: string | Array<string>) => boolean;

    /**
     * Retrieves the entire payload, or a single value with a fallback
     * default when it's missing.
     *
     * @param {string} key - The payload key to look up. Omit to retrieve the entire payload.
     * @param {any} defaultValue - The value to return if the key is not present.
     * @returns {any} The entire payload, or the resolved value for the given key.
     */
    input: (key?: string, defaultValue?: any) => any;

    /**
     * Retrieves only the given payload keys.
     *
     * @param {string|Array<string>} keys - The payload key(s) to keep.
     * @returns {Record<string, any>} A subset of the payload containing only the given keys.
     */
    only: (keys: string | Array<string>) => Record<string, any>;

    /**
     * Retrieves the payload without the given keys.
     *
     * @param {string|Array<string>} keys - The payload key(s) to exclude.
     * @returns {Record<string, any>} A subset of the payload excluding the given keys.
     */
    except: (keys: string | Array<string>) => Record<string, any>;

    /**
     * Replaces the given keys in the payload with new values, leaving
     * every other existing key untouched.
     *
     * @param {Record<string, any>} values - A key-value map to merge into the payload.
     */
    merge: (values: Record<string, any>) => void;

    /**
     * Replaces the entire payload with the given values, discarding
     * anything previously set.
     *
     * @param {Record<string, any>} values - The key-value map to replace the payload with.
     */
    replace: (values: Record<string, any>) => void;

    /**
     * Retrieves a raw value from the payload by key.
     *
     * @param {string} key - The payload key to look up.
     * @returns {any} The value associated with the key, or undefined if not present.
     */
    get: (key: string) => any;

    /**
     * Sets a value on the payload by key.
     *
     * @param {string} key - The payload key to set.
     * @param {any} value - The value to assign to the key.
     */
    set: (key: string, value: any) => void;

    /**
     * Retrieves a payload value coerced to an array.
     *
     * @param {string} key - The payload key to look up.
     * @returns {Array<any>} The value as an array.
     */
    array: (key: string) => Array<any>;

    /**
     * Retrieves a payload value coerced to a boolean.
     *
     * @param {string} key - The payload key to look up.
     * @returns {boolean} The value as a boolean.
     */
    boolean: (key: string) => boolean;

    /**
     * Retrieves a payload value coerced to a floating-point number.
     *
     * @param {string} key - The payload key to look up.
     * @returns {number} The value as a float.
     */
    float: (key: string) => number;

    /**
     * Retrieves a payload value coerced to an integer.
     *
     * @param {string} key - The payload key to look up.
     * @returns {number} The value as an integer.
     */
    integer: (key: string) => number;

    /**
     * Retrieves a payload value coerced to an object.
     *
     * @param {string} key - The payload key to look up.
     * @returns {object} The value as an object.
     */
    object: (key: string) => object;

    /**
     * Retrieves a payload value coerced to a string.
     *
     * @param {string} key - The payload key to look up.
     * @returns {string} The value as a string.
     */
    string: (key: string) => string;

    /**
     * Retrieves an uploaded file from the payload by key.
     *
     * @param {string} key - The payload key to look up.
     * @returns {File|undefined} The uploaded File, or undefined if not present.
     */
    file: (key: string) => File | undefined;

    /**
     * Determines if an uploaded file is present in the payload for the given key.
     *
     * @param {string} key - The payload key to check.
     * @returns {boolean} True if a file is present for the given key.
     */
    hasFile: (key: string) => boolean;

    /**
     * Validates the request payload against a Vine validator. Throws a `ValidatorException`
     * (422) when validation fails.
     *
     * @param {Bejibun.Validator} validator - The Vine validator to run against the payload.
     * @returns {Promise<any>} The validated (and type-coerced) data.
     */
    validate: (validator: Bejibun.Validator) => Promise<any>;
};
