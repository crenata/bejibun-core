/**
 * Holds the application's resolved CORS configuration (as produced by
 * `@bejibun/cors`'s `Cors.init`), set once during `bootstrap.ts` and
 * read wherever CORS headers need to be applied.
 */
export default class CorsLoader {
    /** The active CORS configuration. */
    static cors: Record<string, any>;
    /**
     * Sets the active CORS configuration.
     *
     * @param cors - The CORS configuration to store.
     */
    static set(cors: Record<string, any>): void;
}
