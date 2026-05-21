import type { TSchedule } from "../../types/schedule";
import { CronExpression } from "cron-parser";
type TPreparedSchedule = TSchedule & {
    expression: CronExpression;
    nextRun: number;
};
export default class ScheduleWorkCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string;
    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string;
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>>;
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>>;
    protected running: Set<string>;
    protected interval: NodeJS.Timeout | null;
    protected schedules: Array<TPreparedSchedule>;
    handle(options: any, args: string): Promise<void>;
    private prepareSchedules;
    private startSchedule;
    private stopSchedule;
    private tick;
    private run;
}
export {};
