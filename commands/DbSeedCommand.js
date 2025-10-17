import Chalk from "@bejibun/logger/facades/Chalk";
import ora from "ora";
import path from "path";
import { initDatabase } from "../config/database";
export default class DbSeedCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "db:seed";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Run database seeders";
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
        const spinner = ora(Chalk.setValue("Seeding...")
            .info()
            .show()).start();
        try {
            const logs = (await database.seed.run()).flat();
            spinner.succeed("Seeding finished");
            if (logs.length > 0)
                logs.forEach((seeder) => spinner.succeed(path.basename(seeder)));
            else
                spinner.succeed("No seeders were run.");
        }
        catch (error) {
            spinner.fail(`Seeding failed : ${error.message}`);
        }
        finally {
            await database.destroy();
            spinner.stop();
        }
    }
}
