import Logger from "@bejibun/logger";
import JobModel from "@/models/JobModel";

export default class QueueFlushCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "queue:flush";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Flush all of the failed queue jobs";

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

    public async handle(): Promise<void> {
        await JobModel.query().where("attempts", ">=", 3).delete();

        Logger.setContext("Queue").info("All failed jobs deleted successfully.");
    }
}
