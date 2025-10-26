import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
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
    $arguments = [
        ["<file>", "The name of the controller file"]
    ];
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const controllersDirectory = "controllers";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/${controllersDirectory}/TemplateController.ts`));
        if (!await template.exists()) {
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
