import BaseWebSocket from "@/bases/BaseWebSocket";

/**
 * Registry of discovered WebSocket handler classes, populated by
 * `Kernel.registerWebSockets()` and consumed by `server.ts` to dispatch
 * incoming WebSocket messages to the correct controller.
 */
export default class WebSocketLoader {
    /** Every registered WebSocket handler class. */
    public static controllers: Array<BaseWebSocket> = [];

    /**
     * Registers a WebSocket handler class.
     *
     * @param {BaseWebSocket} schedule - The WebSocket handler class to register.
     */
    public static add(schedule: BaseWebSocket): void {
        WebSocketLoader.controllers.push(schedule);
    }
}
