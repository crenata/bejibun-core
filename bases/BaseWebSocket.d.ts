export default class BaseWebSocket {
    static path: string;
    protected static clients: Record<string, any>;
    get currentPath(): string;
    get connections(): Array<any>;
    static addClient(path: string, client: any): void;
    static removeClient(path: string, client: any): void;
    broadcast(message: any): void;
}
