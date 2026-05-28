import type {TSchedule} from "@/types/schedule";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import CronExpressionParser, {CronExpression} from "cron-parser";
import Kernel from "@/Kernel";
import ScheduleLoader from "@/loader/ScheduleLoader";

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
    protected $signature: string = "schedule:work";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Start the schedule worker";

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

    protected running: Set<string> = new Set<string>();
    protected interval: NodeJS.Timeout | null = null;
    protected schedules: Array<TPreparedSchedule> = [];

    public async handle(options: any, args: string): Promise<void> {
        process.on("exit", async (): Promise<void> => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Schedule worker stopped.");
        });
        process.on("SIGINT", async (): Promise<void> => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGINT sent.");
        });
        process.on("SIGTERM", async (): Promise<void> => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGTERM sent.");
        });

        Kernel.registerSchedulers();

        this.prepareSchedules();

        Logger.setContext("Schedule").info("Schedule worker started.");

        this.startSchedule();
    }

    private prepareSchedules(): void {
        this.schedules = [];

        for (const schedule of ScheduleLoader.schedulers) {
            if (isEmpty(schedule.cron)) continue;

            try {
                const timezone: string = defineValue(schedule.timezone, "UTC");
                const now: Date = Luxon.DateTime.now().setZone(timezone).toJSDate();

                const expression: CronExpression = CronExpressionParser.parse(schedule.cron, {
                    currentDate: now,
                });

                const nextRun: number = expression.next().getTime();

                this.schedules.push({
                    ...schedule,
                    expression,
                    nextRun
                });

                Logger.setContext("Schedule").info(`Registered schedule for command [${schedule.command}].`);
            } catch (error: any) {
                Logger.setContext("Schedule").error(`Invalid cron for [${schedule.command}]: ${schedule.cron}.`).trace(error);
            }
        }
    }

    private startSchedule(): void {
        const tick = (): void => {
            this.tick();

            const delay: number = 1000 - (Date.now() % 1000);

            this.interval = setTimeout(tick, delay);
        };

        tick();
    }

    private stopSchedule(): void {
        if (isNotEmpty(this.interval)) {
            clearTimeout(this.interval as NodeJS.Timeout);

            this.interval = null;
        }
    }

    private tick(): void {
        const now: number = Date.now();

        for (const schedule of this.schedules) {
            if (now >= schedule.nextRun) {
                this.run(schedule);

                schedule.nextRun = schedule.expression.next().getTime();
            }
        }
    }

    private async run(task: TSchedule): Promise<void> {
        if (this.running.has(task.command)) return;

        this.running.add(task.command);

        Logger.setContext("Schedule").info(`Executing schedule for command [${task.command}].`);

        try {
            const proc: Bun.Subprocess = Bun.spawn(["bun", "ace", task.command], {
                cwd: App.Path.rootPath()
            });

            await proc.exited;
        } catch (error: any) {
            Logger.setContext("Schedule").error(`Error running command [${task.command}].`).trace(error);
        } finally {
            this.running.delete(task.command);
        }
    }
}