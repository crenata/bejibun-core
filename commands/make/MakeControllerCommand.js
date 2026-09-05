import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
/**
 * Console command: `Create a new controller file`
 *
 * Registered under the `ace` CLI as `MakeControllerCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class MakeControllerCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:controller";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new controller file";
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    $options = [];
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    $arguments = [["<file>", "The name of the controller file"]];
    /**
     * Executes this command.
     *
     * @param {any} options - Parsed CLI options, matching the flags declared in `$options`.
     * @param {string} args - Parsed positional CLI arguments, matching `$arguments`.
     */
    async handle(options, args) {
        if (!args) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const controllersDirectory = "controllers";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/${controllersDirectory}/TemplateController.ts`));
        if (!(await template.exists())) {
            Logger.setContext("APP").error("Whoops, something went wrong, the controller template not found.");
            return;
        }
        const name = Str.toPascalCase(file.replace(/\s+/g, "").replace(/controller/gi, ""));
        const destination = `${name}Controller.ts`;
        const content = await template.text();
        await Bun.write(App.Path.controllersPath(destination), content.replace(/template/gi, name));
        Logger.setContext("APP").info(`Controller [app/controllers/${destination}] created successfully.`);
    }
}
