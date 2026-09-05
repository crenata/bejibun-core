import App from "@bejibun/app";
import Logger from "@bejibun/logger";

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
    protected $signature: string = "install";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Install package dependencies";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<any>>
     */
    protected $arguments: Array<Array<any>> = [["<packages...>", "Install package dependencies"]];

    /**
     * Executes this command.
     *
     * @param {any} options - Parsed CLI options, matching the flags declared in `$options`.
     * @param {Array<string>} args - Parsed positional CLI arguments, matching `$arguments`.
     */
    public async handle(options: any, args: Array<string>): Promise<void> {
        if (!args) {
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
