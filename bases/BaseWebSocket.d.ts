/**
 * Base class every Bejibun WebSocket handler extends. Tracks connected
 * clients per registered `path` and provides broadcast helpers, so
 * concrete websocket classes only need to implement their message/event
 * handling.
 */
export default class BaseWebSocket {
    /** The route path this websocket class is registered against (set by the router). */
    static path: string;
    /** Connected clients, keyed by websocket `path`. */
    protected static clients: Record<string, any>;
    /**
     * The path this websocket instance is bound to.
     *
     * @throws {RuntimeException} If no `path` has been set on the class.
     */
    get currentPath(): string;
    /** Every currently-connected client for this websocket's path. */
    get connections(): Array<any>;
    /**
     * Registers a newly-connected client under the given path.
     *
     * @param path - The websocket path the client connected to.
     * @param client - The client/connection instance to register.
     */
    static addClient(path: string, client: any): void;
    /**
     * Removes a disconnected client from the given path's registry.
     *
     * @param path - The websocket path the client was connected to.
     * @param client - The client/connection instance to remove.
     */
    static removeClient(path: string, client: any): void;
    /**
     * Sends a message to every open connection on this websocket's path.
     *
     * @param message - The message to broadcast.
     */
    broadcast(message: any): void;
}
