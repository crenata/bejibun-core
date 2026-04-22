import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import CronExpressionParser from "cron-parser";
import Kernel from "../../commands/Kernel";
import ScheduleLoader from "../../loader/ScheduleLoader";
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
    running = new Set();
    lastRuns = new Map();
    interval = null;
    async handle(options, args) {
        process.on("exit", async () => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Schedule worker stopped.");
        });
        process.on("SIGINT", async () => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGINT sent.");
        });
        process.on("SIGTERM", async () => {
            this.stopSchedule();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGTERM sent.");
        });
        Kernel.registerSchedulers();
        Logger.setContext("Schedule").info("Schedule worker started.");
        this.startSchedule();
    }
    startSchedule() {
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    }
    stopSchedule() {
        if (isNotEmpty(this.interval)) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    tick() {
        for (const schedule of ScheduleLoader.schedulers) {
            const now = Luxon.DateTime.now().setZone(defineValue(schedule.timezone, "UTC")).toJSDate();
            if (this.shouldRun(schedule, now)) {
                this.run(schedule);
            }
        }
    }
    shouldRun(task, now) {
        if (isEmpty(task.cron))
            return false;
        try {
            const interval = CronExpressionParser.parse(task.cron, {
                currentDate: now
            });
            const prev = interval.prev().getTime();
            const lastRun = this.lastRuns.get(task.command);
            if (lastRun === prev)
                return false;
            if (Math.abs(now.getTime() - prev) < 1000) {
                this.lastRuns.set(task.command, prev);
                return true;
            }
            return false;
        }
        catch (error) {
            Logger.setContext("Schedule").error(`Invalid cron for [${task.command}]: ${task.cron}.`).trace(error);
            return false;
        }
    }
    run(task) {
        if (this.running.has(task.command))
            return;
        this.running.add(task.command);
        Logger.setContext("Schedule").info(`Executing schedule for command [${task.command}].`);
        try {
            Bun.spawnSync(["bun", "ace", task.command], {
                cwd: App.Path.rootPath()
            });
        }
        catch (error) {
            Logger.setContext("Schedule").error(`Error running command [${task.command}].`).trace(error);
        }
        this.running.delete(task.command);
    }
}
