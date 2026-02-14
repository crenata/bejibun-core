import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { isEmpty, isNotEmpty } from "@bejibun/utils";
import RuntimeException from "../../exceptions/RuntimeException";
import Schedule from "../../facades/Schedule";
export default class ScheduleWorkCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "schedule:work";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Start the schedule worker";
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
    $arguments = [];
    async handle(options, args) {
        let interval = null;
        process.on("exit", async () => {
            if (isNotEmpty(interval))
                clearInterval(interval);
            Logger.setContext("Queue").info("Schedule worker stopped.");
        });
        process.on("SIGINT", async () => {
            if (isNotEmpty(interval))
                clearInterval(interval);
            Logger.setContext("Queue").info("Stopping schedule worker, SIGINT sent.");
        });
        process.on("SIGTERM", async () => {
            if (isNotEmpty(interval))
                clearInterval(interval);
            Logger.setContext("Queue").info("Stopping schedule worker, SIGTERM sent.");
        });
        const schedule = async () => {
            const kernelPath = App.Path.commandsPath("Kernel.ts");
            const module = await import(kernelPath);
            const Kernel = module.default;
            if (isEmpty(Kernel))
                throw new RuntimeException(`Kernel class not found [${kernelPath}].`);
            const instance = new Kernel();
            if (typeof instance.schedule !== "function")
                throw new RuntimeException(`Kernel class has no schedule function in [${kernelPath}].`);
            instance.schedule(Schedule);
        };
        interval = setInterval(() => {
            Logger.debug("asd");
        }, 1000);
    }
}
