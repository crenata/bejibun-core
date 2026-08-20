import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
export default class MakeJobCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "make:job";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Create a new job file";
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
    $arguments = [["<file>", "The name of the job file"]];
    async handle(options, args) {
        if (isEmpty(args)) {
            Logger.setContext("APP").error("There is no filename provided.");
            return;
        }
        const file = args;
        const jobsDirectory = "jobs";
        const template = Bun.file(path.resolve(__dirname, `../../stubs/${jobsDirectory}/TemplateJob.ts`));
        if (!(await template.exists())) {
            Logger.setContext("APP").error("Whoops, something went wrong, the job template not found.");
            return;
        }
        const name = Str.toPascalCase(file.replace(/\s+/g, "").replace(/job/gi, ""));
        const destination = `${name}Job.ts`;
        const content = await template.text();
        await Bun.write(App.Path.jobsPath(destination), content.replace(/template/gi, name));
        Logger.setContext("APP").info(`Job [app/jobs/${destination}] created successfully.`);
    }
}
