import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import {initDatabase} from "@/config/database";

export default class MigrateStatusCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "migrate:status";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "List migrations status";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<string>>
     */
    protected $options: Array<Array<string>> = [
        ["-f, --force", "Skip command confirmation."]
    ];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [];

    public async handle(options: any, args: Array<string>): Promise<void> {
        const database = initDatabase();

        const spinner = ora(
            Chalk.setValue("Fetching...")
                .info()
                .show()
        ).start();

        try {
            const [completed, pending] = await database.migrate.list();

            spinner.succeed("Completed Migrations :");
            if (completed.length > 0) completed.forEach((migration: { name: string }) => spinner.succeed(migration.name));
            else spinner.succeed("No migrations were completed.");

            console.log();

            spinner.succeed("Pending Migrations :");
            if (pending.length > 0) pending.forEach((migration: { file: string, directory: string }) => spinner.succeed(migration.file));
            else spinner.succeed("No migrations were pending.");
        } catch (error: any) {
            spinner.fail(`Fetching failed : ${error.message}`);
        } finally {
            await database.destroy();
            spinner.stop();
        }
    }
}