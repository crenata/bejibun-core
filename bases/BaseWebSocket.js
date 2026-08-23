import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import RuntimeException from "../exceptions/RuntimeException";
/**
 * Base class every Bejibun WebSocket handler extends. Tracks connected
 * clients per registered `path` and provides broadcast helpers, so
 * concrete websocket classes only need to implement their message/event
 * handling.
 */
export default class BaseWebSocket {
    /** The route path this websocket class is registered against (set by the router). */
    static path;
    /** Connected clients, keyed by websocket `path`. */
    static clients = {};
    /**
     * The path this websocket instance is bound to.
     *
     * @throws {RuntimeException} If no `path` has been set on the class.
     */
    get currentPath() {
        const path = this.constructor.path;
        if (isEmpty(path))
            throw new RuntimeException("WebSocket path is empty.");
        return path;
    }
    /** Every currently-connected client for this websocket's path. */
    get connections() {
        return defineValue(BaseWebSocket.clients[this.currentPath], []);
    }
    /**
     * Registers a newly-connected client under the given path.
     *
     * @param path - The websocket path the client connected to.
     * @param client - The client/connection instance to register.
     */
    static addClient(path, client) {
        if (isEmpty(BaseWebSocket.clients[path]))
            BaseWebSocket.clients[path] = [];
        BaseWebSocket.clients[path].push(client);
    }
    /**
     * Removes a disconnected client from the given path's registry.
     *
     * @param path - The websocket path the client was connected to.
     * @param client - The client/connection instance to remove.
     */
    static removeClient(path, client) {
        if (isNotEmpty(BaseWebSocket.clients[path])) {
            BaseWebSocket.clients[path] = BaseWebSocket.clients[path].filter((connection) => connection !== client);
        }
    }
    /**
     * Sends a message to every open connection on this websocket's path.
     *
     * @param message - The message to broadcast.
     */
    broadcast(message) {
        for (const connection of this.connections) {
            if (connection.readyState === 1) {
                connection.send(message);
            }
        }
    }
}
