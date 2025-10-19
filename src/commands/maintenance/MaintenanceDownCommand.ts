import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {DateTime} from "luxon";

export default class MaintenanceDownCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "maintenance:down";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Turn app into maintenance mode";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [
        ["-a, --allows <ips>", "Whitelist IPs from accessing application in maintenance mode. e.g. --allows=127.0.0.1,127.0.0.2", (value: string): Array<string> => value.split(","), []]
    ];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [];

    public async handle(options: any, args: Array<string>): Promise<void> {
        await Bun.write(App.storagePath("framework/maintenance.down.json"), JSON.stringify({
            message: "🚧 We're doing maintenance. Please check back soon.",
            status: 503,
            allows: options.allows,
            unix: Math.floor(DateTime.now().toSeconds())
        }, null, 2));

        Logger.setContext("APP").info("Application turned into maintenance mode.");
    }
}