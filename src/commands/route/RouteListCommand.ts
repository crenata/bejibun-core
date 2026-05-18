import {defineValue} from "@bejibun/utils";

export default class RouteListCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "route:list";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "List all registered routes";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [];

    public async handle(options: any, args: string): Promise<void> {
        const url: string = defineValue(`${Bun.env.APP_URL}/apis`, "http://localhost:3000/apis");

        let proc: Bun.Subprocess;

        switch (process.platform) {
            case "darwin":
                proc = Bun.spawn(["open", url], {
                    stdout: "ignore",
                    stderr: "ignore",
                    detached: true
                });
                break;
            case "win32":
                proc = Bun.spawn(["cmd", "/c", "start", url], {
                    stdout: "ignore",
                    stderr: "ignore",
                    detached: true
                });
                break;
            default:
                proc = Bun.spawn(["xdg-open", url], {
                    stdout: "ignore",
                    stderr: "ignore",
                    detached: true
                });
        }

        proc.unref();
    }
}