import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
export default class MakeValidatorCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:validator";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new validator file";
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
        ["<file>", "The name of the validator file"]
    ];
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const validatorsDirectory = "validators";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/${validatorsDirectory}/TemplateValidator.ts`));
        if (!await template.exists()) {
            Logger.setContext("APP").error("Whoops, something went wrong, the validator template not found.");
            return;
        }
        const name = Str.toPascalCase(file.replace(/\s+/g, "").replace(/validator/gi, ""));
        const destination = `${name}Validator.ts`;
        const content = await template.text();
        await Bun.write(App.Path.validatorsPath(destination), content.replace(/template/gi, name));
        Logger.setContext("APP").info(`Validator [app/validators/${destination}] created successfully.`);
    }
}
