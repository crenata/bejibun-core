/**
 * Default queue configuration. Defines the active connection (via the
 * `QUEUE_DRIVER` env var, defaulting to `"database"`) and the settings
 * for each available connection driver.
 */
declare const config: Record<string, any>;
export default config;
