import { defineValue } from "@bejibun/utils";
export default class RouteListCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "route:list";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "List all registered routes";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    async handle() {
        const url = defineValue(`${Bun.env.APP_URL}/apis`, "http://localhost:3000/apis");
        let proc;
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
