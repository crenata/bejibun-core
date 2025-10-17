import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import { initDatabase } from "../config/database";
export default class MigrateLatestCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "migrate:latest";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Run latest migration";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<string>>
     */
    $options = [];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [];
    async handle(options, args) {
        const database = initDatabase();
        const spinner = ora(Chalk.setValue("Migrating...")
            .info()
            .show()).start();
        try {
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
