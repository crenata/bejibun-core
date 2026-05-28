export default class Server {
    private get exceptionHandler();
    private get apiRoutes();
    private get webSocketRoutes();
    private get webRoutes();
    private get performance();
    private get route();
    private get websocket();
    run(): Promise<void>;
}
