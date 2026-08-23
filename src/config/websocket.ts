/**
 * Default WebSocket server configuration, passed through to Bun's
 * websocket options when upgrading connections.
 */
const config: Record<string, any> = {
    /** Maximum allowed message size, in bytes (default: 16 MiB). */
    maxPayloadLength: 1024 * 1024 * 16,

    /** Buffered-bytes threshold at which backpressure kicks in (default: 16 MiB). */
    backpressureLimit: 1024 * 1024 * 16,

    /** Whether to close the connection once `backpressureLimit` is exceeded. */
    closeOnBackpressureLimit: false,

    /** Seconds of inactivity before an idle connection is closed. */
    idleTimeout: 60,

    /** Whether `publish()` calls also deliver to the publishing client itself. */
    publishToSelf: false,

    /** Whether to send periodic ping frames to keep connections alive. */
    sendPings: false
};

export default config;
