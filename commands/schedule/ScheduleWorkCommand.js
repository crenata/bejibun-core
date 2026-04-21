import App from "@bejibun/app";
import Logger from "@bejibun/logger";
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
    timeouts = new Map();
    running = new Set();
    async handle(options, args) {
        process.on("exit", async () => {
            this.stopAll();
            Logger.setContext("Schedule").info("Schedule worker stopped.");
        });
        process.on("SIGINT", async () => {
            this.stopAll();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGINT sent.");
        });
        process.on("SIGTERM", async () => {
            this.stopAll();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGTERM sent.");
        });
        Kernel.registerSchedulers();
        ScheduleLoader.schedulers.forEach((scheduler) => {
            this.scheduleAligned(scheduler);
        });
    }
    scheduleAligned(task) {
        const intervalMs = task.timer * 1000;
        const scheduleNext = () => {
            const now = Date.now();
            const nextRun = Math.floor(now / intervalMs) * intervalMs + intervalMs;
            const delay = nextRun - now;
            const timeout = setTimeout(() => {
                if (this.running.has(task.command))
                    return scheduleNext();
                this.running.add(task.command);
                Logger.setContext("Schedule").info(`Executing schedule for command [${task.command}].`);
                Bun.spawnSync(["bun", "ace", task.command], {
                    cwd: App.Path.rootPath()
                });
                this.running.delete(task.command);
                scheduleNext();
            }, delay);
            this.timeouts.set(task.command, timeout);
        };
        scheduleNext();
    }
    stopAll() {
        for (const timeout of this.timeouts.values()) {
            clearTimeout(timeout);
        }
        this.timeouts.clear();
    }
}
