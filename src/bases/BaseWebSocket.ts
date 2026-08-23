import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import RuntimeException from "@/exceptions/RuntimeException";

/**
 * Base class every Bejibun WebSocket handler extends. Tracks connected
 * clients per registered `path` and provides broadcast helpers, so
 * concrete websocket classes only need to implement their message/event
 * handling.
 */
export default class BaseWebSocket {
    /** The route path this websocket class is registered against (set by the router). */
    public static path: string;

    /** Connected clients, keyed by websocket `path`. */
    protected static clients: Record<string, any> = {};

    /**
     * The path this websocket instance is bound to.
     *
     * @throws {RuntimeException} If no `path` has been set on the class.
     */
    public get currentPath(): string {
        const path: string = (this.constructor as any).path;

        if (isEmpty(path)) throw new RuntimeException("WebSocket path is empty.");

        return path;
    }

    /** Every currently-connected client for this websocket's path. */
    public get connections(): Array<any> {
        return defineValue(BaseWebSocket.clients[this.currentPath], []);
    }

    /**
     * Registers a newly-connected client under the given path.
     *
     * @param path - The websocket path the client connected to.
     * @param client - The client/connection instance to register.
     */
    public static addClient(path: string, client: any): void {
        if (isEmpty(BaseWebSocket.clients[path])) BaseWebSocket.clients[path] = [];

        BaseWebSocket.clients[path].push(client);
    }

    /**
     * Removes a disconnected client from the given path's registry.
     *
     * @param path - The websocket path the client was connected to.
     * @param client - The client/connection instance to remove.
     */
    public static removeClient(path: string, client: any): void {
        if (isNotEmpty(BaseWebSocket.clients[path])) {
            BaseWebSocket.clients[path] = BaseWebSocket.clients[path].filter(
                (connection: any) => connection !== client
            );
        }
    }

    /**
     * Sends a message to every open connection on this websocket's path.
     *
     * @param message - The message to broadcast.
     */
    public broadcast(message: any): void {
        for (const connection of this.connections) {
            if (connection.readyState === 1) {
                connection.send(message);
            }
        }
    }
}
