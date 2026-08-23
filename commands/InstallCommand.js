import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
/**
 * Console command: `Install package dependencies`
 *
 * Registered under the `ace` CLI as `InstallCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class InstallCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "install";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Install package dependencies";
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
    $arguments = [["<packages...>", "Install package dependencies"]];
    /**
     * Executes this command.
     *
     * @param options - Parsed CLI options, matching the flags declared in `$options`.
     * @param args - Parsed positional CLI arguments, matching `$arguments`.
     */
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no packages provided.");
            return;
        }
        for (const pack of args) {
            Bun.spawnSync(["bun", "add", pack], {
                cwd: App.Path.rootPath(),
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit"
            });
            Bun.spawnSync(["bun", "ace", "package:configure", "--package", pack], {
                cwd: App.Path.rootPath(),
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit"
            });
        }
    }
}
