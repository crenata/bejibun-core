import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import RuntimeException from "@/exceptions/RuntimeException";

export default class BaseWebSocket {
    public static path: string;
    protected static clients: Record<string, any> = {};

    public get currentPath(): string {
        const path: string = (this.constructor as any).path;

        if (isEmpty(path)) throw new RuntimeException("WebSocket path is empty.");

        return path;
    }

    public get connections(): Array<any> {
        return defineValue(BaseWebSocket.clients[this.currentPath], []);
    }

    public static addClient(path: string, client: any): void {
        if (isEmpty(BaseWebSocket.clients[path])) BaseWebSocket.clients[path] = [];

        BaseWebSocket.clients[path].push(client);
    }

    public static removeClient(path: string, client: any): void {
        if (isNotEmpty(BaseWebSocket.clients[path])) {
            BaseWebSocket.clients[path] = BaseWebSocket.clients[path].filter((connection: any) => connection !== client);
        }
    }

    public broadcast(message: any): void {
        for (const connection of this.connections) {
            if (connection.readyState === 1) {
                connection.send(message);
            }
        }
    }
}