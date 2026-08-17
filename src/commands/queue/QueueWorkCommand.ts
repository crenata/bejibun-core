import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import QueueConfig from "@/config/queue";
import QueueException from "@/exceptions/QueueException";
import RuntimeException from "@/exceptions/RuntimeException";
import JobModel from "@/models/JobModel";
import fs from "fs";

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
        const configPath = App.Path.configPath("queue.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = QueueConfig;

        if (isEmpty(config)) throw new QueueException("There is no config provided.");

        const currentConnection: Record<string, any> = config.connections[config.default];
        const retryAfter: number = defineValue(Number(currentConnection?.retry_after), 60);

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
            const staleBefore: number = Luxon.DateTime.now().toUnixInteger() - retryAfter;

            const job: any = await JobModel.query()
                .where("attempts", "<", 3)
                .where((builder: any) =>
                    builder.whereNull("reserved_at")
                        .orWhere("reserved_at", "<", staleBefore)
                )
                .orderBy("id", "asc")
                .first();

            if (isEmpty(job?.id)) {
                await Bun.sleep(retryAfter * 1000);
            } else {
                const claimed: any = await JobModel.query()
                    .where("id", job.id)
                    .where("attempts", "<", 3)
                    .where((builder: any) =>
                        builder.whereNull("reserved_at")
                            .orWhere("reserved_at", "<", staleBefore)
                    )
                    .update({
                        reserved_at: Luxon.DateTime.now().toUnixInteger()
                    });
                if (isEmpty(claimed)) continue;

                const handler: Function = async () => {
                    const module = await import(App.Path.rootPath(job.queue));

                    const Class = module.default;
                    if (isEmpty(Class)) throw new RuntimeException(`Job class not found [${job.queue}].`);

                    const instance = new Class();
                    if (typeof instance.handle !== "function") throw new RuntimeException(`Job class has no handle function in [${job.queue}].`);

                    instance.handle(Bun.JSON5.parse(job.payload));
                };

                try {
                    await handler();
                    await JobModel.query().findById(job.id).delete();
                } catch {
                    await JobModel.query().findById(job.id).update({
                        attempts: defineValue(Number(job.attempts), 0) + 1,
                        reserved_at: null
                    });

                    await Bun.sleep(retryAfter * 1000);
                }
            }
        }
    }
}