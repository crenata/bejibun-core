import Chalk from "@bejibun/logger/facades/Chalk";
import { ask, isNotEmpty } from "@bejibun/utils";
import ora from "ora";
import { initDatabase } from "../config/database";
export default class MigrateRollbackCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:rollback";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Rollback the latest migrations";
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
            confirm = await ask(Chalk.setValue("This will ROLLBACK latest migrations. Are you want to continue? (Y/N): ")
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
                const [batchNo, logs] = await database.migrate.rollback();
                spinner.succeed(`Batch ${batchNo} finished`);
                if (logs.length > 0)
                    logs.forEach((migration) => spinner.succeed(migration));
                else
                    spinner.succeed("No migrations were rolled back.");
            }
            catch (error) {
                spinner.fail(`Rollback failed : ${error.message}`);
            }
            finally {
                await database.destroy();
                spinner.stop();
            }
        }
    }
}
