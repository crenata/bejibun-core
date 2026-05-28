const config: Record<string, any> = {
    maxPayloadLength: 1024 * 1024 * 16,

    backpressureLimit: 1024 * 1024 * 16,

    closeOnBackpressureLimit: false,

    idleTimeout: 60,

    publishToSelf: false,

    sendPings: false
};

export default config;