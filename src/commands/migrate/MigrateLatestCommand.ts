import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import {initDatabase} from "@/config/database";

export default class MigrateLatestCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "migrate:latest";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Run latest migration";

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

    public async handle(options: any, args: Array<string>): Promise<void> {
        const database = initDatabase();

        const spinner = ora(
            Chalk.setValue("Migrating...")
                .info()
                .show()
        ).start();

        try {
            const [batchNo, logs] = await database.migrate.latest();
            spinner.succeed(`Batch ${batchNo} finished`);

            if (logs.length > 0) logs.forEach((migration: string) => spinner.succeed(migration));
            else spinner.succeed("No migrations were run.");
        } catch (error: any) {
            spinner.fail(`Migration failed : ${error.message}`);
        } finally {
            await database.destroy();
            spinner.stop();
        }
    }
}