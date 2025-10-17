import Chalk from "@bejibun/logger/facades/Chalk";
import { ask, isNotEmpty } from "@bejibun/utils";
import ora from "ora";
import { initDatabase } from "../config/database";
export default class MigrateFreshCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:fresh";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Rollback all migrations and re-run migrations";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<string>>
     */
    $options = [
        ["-f, --force", "Skip command confirmation."]
    ];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    async handle(options, args) {
        const database = initDatabase();
        const bypass = isNotEmpty(options.force);
        let confirm = "Y";
        if (!bypass)
            confirm = await ask(Chalk.setValue("This will DROP ALL tables and re-run ALL migrations. Are you want to continue? (Y/N): ")
                .inline()
                .error()
                .show());
        if (confirm.toUpperCase() === "Y") {
            if (!bypass)
                console.log();
            const spinner = ora(Chalk.setValue("Rollback...")
                .info()
                .show()).start();
            try {
                await database.migrate.rollback({}, true);
                spinner.succeed("Rolled back all migrations");
                const [batchNo, logs] = await database.migrate.latest();
                spinner.succeed(`Batch ${batchNo} finished`);
                if (logs.length > 0)
                    logs.forEach((migration) => spinner.succeed(migration));
                else
                    spinner.succeed("No migrations were run.");
            }
            catch (error) {
                spinner.fail(`Migration failed : ${error.message}`);
            }
            finally {
                await database.destroy();
                spinner.stop();
            }
        }
    }
}
