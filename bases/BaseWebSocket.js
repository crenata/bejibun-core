import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import RuntimeException from "../exceptions/RuntimeException";
export default class BaseWebSocket {
    static path;
    static clients = {};
    get currentPath() {
        const path = this.constructor.path;
        if (isEmpty(path))
            throw new RuntimeException("WebSocket path is empty.");
        return path;
    }
    get connections() {
        return defineValue(BaseWebSocket.clients[this.currentPath], []);
    }
    static addClient(path, client) {
        if (isEmpty(BaseWebSocket.clients[path]))
            BaseWebSocket.clients[path] = [];
        BaseWebSocket.clients[path].push(client);
    }
    static removeClient(path, client) {
        if (isNotEmpty(BaseWebSocket.clients[path])) {
            BaseWebSocket.clients[path] = BaseWebSocket.clients[path].filter((connection) => connection !== client);
        }
    }
    broadcast(message) {
        for (const connection of this.connections) {
            if (connection.readyState === 1) {
                connection.send(message);
            }
        }
    }
}
