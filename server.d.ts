export default class Server {
    private get exceptionHandler();
    private get apiRoutes();
    private get webRoutes();
    private get performance();
    private get route();
    run(): Promise<void>;
}
