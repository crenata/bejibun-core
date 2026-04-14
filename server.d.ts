export default class Server {
    private get exceptionHandler();
    private get apiRoutes();
    private get webRoutes();
    run(): Promise<void>;
}
