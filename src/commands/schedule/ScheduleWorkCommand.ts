import type {TSchedule} from "@/types/schedule";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import CronExpressionParser, {CronExpression} from "cron-parser";
import Kernel from "@/commands/Kernel";
import ScheduleLoader from "@/loader/ScheduleLoader";

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
    protected lastRuns: Map<string, number> = new Map<string, number>();
    protected interval: NodeJS.Timeout | null = null;

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

        Logger.setContext("Schedule").info("Schedule worker started.");

        this.startSchedule();
    }

    private startSchedule(): void {
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    private stopSchedule(): void {
        if (isNotEmpty(this.interval)) {
            clearInterval(this.interval as NodeJS.Timeout);
            this.interval = null;
        }
    }

    private tick(): void {
        for (const schedule of ScheduleLoader.schedulers) {
            const now: Date = Luxon.DateTime.now().setZone(defineValue(schedule.timezone, "UTC")).toJSDate();

            if (this.shouldRun(schedule, now)) {
                this.run(schedule);
            }
        }
    }

    private shouldRun(task: TSchedule, now: Date): boolean {
        if (isEmpty(task.cron)) return false;

        try {
            const interval: CronExpression = CronExpressionParser.parse(task.cron, {
                currentDate: now
            });
            const prev: number = interval.prev().getTime();
            const lastRun: number | undefined = this.lastRuns.get(task.command);

            if (lastRun === prev) return false;

            if (Math.abs(now.getTime() - prev) < 1000) {
                this.lastRuns.set(task.command, prev);

                return true;
            }

            return false;
        } catch (error: any) {
            Logger.setContext("Schedule").error(`Invalid cron for [${task.command}]: ${task.cron}.`).trace(error);

            return false;
        }
    }

    private run(task: TSchedule): void {
        if (this.running.has(task.command)) return;

        this.running.add(task.command);

        Logger.setContext("Schedule").info(`Executing schedule for command [${task.command}].`);

        try {
            Bun.spawnSync(["bun", "ace", task.command], {
                cwd: App.Path.rootPath()
            });
        } catch (error: any) {
            Logger.setContext("Schedule").error(`Error running command [${task.command}].`).trace(error);
        }

        this.running.delete(task.command);
    }
}