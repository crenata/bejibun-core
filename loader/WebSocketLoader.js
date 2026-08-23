/**
 * Registry of discovered WebSocket handler classes, populated by
 * `Kernel.registerWebSockets()` and consumed by `server.ts` to dispatch
 * incoming WebSocket messages to the correct controller.
 */
export default class WebSocketLoader {
    /** Every registered WebSocket handler class. */
    static controllers = [];
    /**
     * Registers a WebSocket handler class.
     *
     * @param schedule - The WebSocket handler class to register.
     */
    static add(schedule) {
        WebSocketLoader.controllers.push(schedule);
    }
}
