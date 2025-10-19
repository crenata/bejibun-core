import Logger from "@bejibun/logger";
import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import { initDatabase } from "../../config/database";
export default class MigrateStatusCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:status";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "List migrations status";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [
        ["-f, --force", "Skip command confirmation"]
    ];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    async handle(options, args) {
        const database = initDatabase();
        const spinner = ora(Chalk.setValue("Fetching...")
            .info()
            .show()).start();
        try {
            const [completed, pending] = await database.migrate.list();
            spinner.succeed("Completed Migrations :");
            if (completed.length > 0)
                completed.forEach((migration) => spinner.succeed(migration.name));
            else
                spinner.succeed("No migrations were completed.");
            Logger.empty();
            spinner.succeed("Pending Migrations :");
            if (pending.length > 0)
                pending.forEach((migration) => spinner.succeed(migration.file));
            else
                spinner.succeed("No migrations were pending.");
        }
        catch (error) {
            spinner.fail(`Fetching failed : ${error.message}`);
        }
        finally {
            await database.destroy();
            spinner.stop();
        }
    }
}
