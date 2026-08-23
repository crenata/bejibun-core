import type { TSchedule } from "../../types/schedule";
import { CronExpression } from "cron-parser";
type TPreparedSchedule = TSchedule & {
    expression: CronExpression;
    nextRun: number;
};
/**
 * Console command: `Start the schedule worker`
 *
 * Registered under the `ace` CLI as `ScheduleWorkCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
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
    /**
     * Executes this command.
     */
    handle(): Promise<void>;
    private prepareSchedules;
    private startSchedule;
    private stopSchedule;
    private tick;
    private run;
}
export {};
