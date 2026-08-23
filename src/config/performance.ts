/**
 * Performance-related feature toggles. Controls whether certain
 * built-in middlewares are automatically enabled framework-wide.
 */
const config: Record<string, any> = {
    /** Which optional built-in middlewares are active. */
    middlewares: {
        /** Whether the rate-limiter middleware runs on every route. */
        limiter: true,

        /** Whether the maintenance-mode middleware runs on every route. */
        maintenance: true
    }
};

export default config;
