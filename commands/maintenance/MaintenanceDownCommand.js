import AppConfig from "@bejibun/app/config/app";
import Logger from "@bejibun/logger";
import { DateTime } from "luxon";
export default class MaintenanceDownCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "maintenance:down";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Turn app into maintenance mode";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [
        ["-a, --allows <ips>", "Whitelist IPs from accessing application in maintenance mode. e.g. --allows=127.0.0.1,127.0.0.2", (value) => value.split(","), []]
    ];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    async handle(options, args) {
        await Bun.write(AppConfig.maintenance.file, JSON.stringify({
            message: "🚧 We're doing maintenance. Please check back soon.",
            status: 503,
            allows: options.allows,
            unix: Math.floor(DateTime.now().toSeconds())
        }, null, 2));
        Logger.setContext("APP").info("Application turned into maintenance mode.");
    }
}
