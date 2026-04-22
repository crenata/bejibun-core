import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import RuntimeException from "@/exceptions/RuntimeException";
import JobModel from "@/models/JobModel";

export default class QueueWorkCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "queue:work";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Start processing jobs on the queue as a daemon";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>> = [];

    public async handle(options: any, args: string): Promise<void> {
        let running: boolean = true;

        process.on("exit", async (): Promise<void> => {
            running = false;
            Logger.setContext("Queue").info("Queue worker stopped.");
        });
        process.on("SIGINT", async (): Promise<void> => {
            running = false;
            Logger.setContext("Queue").info("Stopping queue worker, SIGINT sent.");
        });
        process.on("SIGTERM", async (): Promise<void> => {
            running = false;
            Logger.setContext("Queue").info("Stopping queue worker, SIGTERM sent.");
        });

        Logger.setContext("Queue").info("Queue worker started.");

        while (running) {
            const job: any = await JobModel.query().where("attempts", "<", 3).orderBy("id", "asc").first();

            if (isNotEmpty(job?.id)) {
                const handler: Function = async () => {
                    const module = await import(App.Path.rootPath(job.queue));

                    const Class = module.default;
                    if (isEmpty(Class)) throw new RuntimeException(`Job class not found [${job.queue}].`);

                    const instance = new Class();
                    if (typeof instance.handle !== "function") throw new RuntimeException(`Job class has no handle function in [${job.queue}].`);

                    instance.handle(JSON.parse(job.payload));
                };

                try {
                    await handler();
                    await JobModel.query().findById(job.id).delete();
                } catch {
                    await JobModel.query().findById(job.id).update({
                        attempts: defineValue(Number(job.attempts), 0) + 1
                    });
                }
            }
        }
    }
}