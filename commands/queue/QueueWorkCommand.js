import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import RuntimeException from "../../exceptions/RuntimeException";
import JobModel from "../../models/JobModel";
export default class QueueWorkCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    $signature = "queue:work";
    /**
     * The console command description.
     *
     * @var $description string
     */
    $description = "Start processing jobs on the queue as a daemon";
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
        let running = true;
        process.on("exit", async () => {
            running = false;
            Logger.setContext("Queue").info("Queue worker stopped.");
        });
        process.on("SIGINT", async () => {
            running = false;
            Logger.setContext("Queue").info("Stopping queue worker, SIGINT sent.");
        });
        process.on("SIGTERM", async () => {
            running = false;
            Logger.setContext("Queue").info("Stopping queue worker, SIGTERM sent.");
        });
        Logger.setContext("Queue").info("Queue worker started.");
        while (running) {
            const job = await JobModel.query().where("attempts", "<", 3).orderBy("id", "asc").first();
            if (isEmpty(job?.id)) {
                await Bun.sleep(1000);
            }
            else {
                const handler = async () => {
                    const module = await import(App.Path.rootPath(job.queue));
                    const Class = module.default;
                    if (isEmpty(Class))
                        throw new RuntimeException(`Job class not found [${job.queue}].`);
                    const instance = new Class();
                    if (typeof instance.handle !== "function")
                        throw new RuntimeException(`Job class has no handle function in [${job.queue}].`);
                    instance.handle(Bun.JSON5.parse(job.payload));
                };
                try {
                    await handler();
                    await JobModel.query().findById(job.id).delete();
                }
                catch {
                    await JobModel.query().findById(job.id).update({
                        attempts: defineValue(Number(job.attempts), 0) + 1
                    });
                }
            }
        }
    }
}
