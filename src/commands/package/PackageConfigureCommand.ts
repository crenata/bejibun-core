import App from "@bejibun/app";
import Logger from "@bejibun/logger";

/**
 * Console command: `Configure package after installation`
 *
 * Registered under the `ace` CLI as `PackageConfigureCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class PackageConfigureCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "package:configure";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Configure package after installation";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [
        ["-p, --package <name>", "Run package configuration file. e.g. --package=@bejibun/database"]
    ];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<any>>
     */
    protected $arguments: Array<Array<any>> = [];

    /**
     * Executes this command.
     *
     * @param {any} options - Parsed CLI options, matching the flags declared in `$options`.
     */
    public async handle(options: any): Promise<void> {
        if (!options.package) {
            Logger.setContext("APP").error("Package is not provided, please use --package.");
            return;
        }

        try {
            await import(App.Path.rootPath(`node_modules/${options.package}/configure`));

            Logger.setContext("APP").info("The package has been successfully configured.");
        } catch (error: any) {
            if (error?.message.includes("Cannot find module")) return;

            Logger.setContext("APP")
                .error(error?.message ?? "Whoops, something went wrong.")
                .trace(error);
        }
    }
}
