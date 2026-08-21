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
};
