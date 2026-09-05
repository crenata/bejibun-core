import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
/**
 * Console command: `Create a new middleware file`
 *
 * Registered under the `ace` CLI as `MakeMiddlewareCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class MakeMiddlewareCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:middleware";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new middleware file";
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
    $arguments = [["<file>", "The name of the middleware file"]];
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
        const middlewaresDirectory = "middlewares";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/${middlewaresDirectory}/TemplateMiddleware.ts`));
        if (!(await template.exists())) {
            Logger.setContext("APP").error("Whoops, something went wrong, the middleware template not found.");
            return;
        }
        const name = Str.toPascalCase(file.replace(/\s+/g, "").replace(/middleware/gi, ""));
        const destination = `${name}Middleware.ts`;
        const content = await template.text();
        await Bun.write(App.Path.middlewaresPath(destination), content.replace(/template/gi, name));
        Logger.setContext("APP").info(`Middleware [app/middlewares/${destination}] created successfully.`);
    }
}
