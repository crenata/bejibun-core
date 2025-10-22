import App from "@bejibun/app";
import AppConfig from "@bejibun/app/config/app";
import Logger from "@bejibun/logger";
export default class MaintenanceUpCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "maintenance:up";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Turn app into live mode";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<any>>
     */
    $arguments = [];
    async handle(options, args) {
        if (await App.Maintenance.isMaintenanceMode())
            await Bun.file(AppConfig.maintenance.file).delete();
        Logger.setContext("APP").info("Application turned into live mode.");
    }
}
