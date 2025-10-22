import App from "@bejibun/app";
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
    $arguments = [
        ["<packages...>", "Install package dependencies"]
    ];
    async handle(options, args) {
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
