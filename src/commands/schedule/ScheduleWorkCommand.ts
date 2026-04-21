import type {TSchedule} from "@/types/schedule";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
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

    protected timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<string, ReturnType<typeof setTimeout>>();
    protected running: Set<string> = new Set<string>();

    public async handle(options: any, args: string): Promise<void> {
        process.on("exit", async (): Promise<void> => {
            this.stopAll();
            Logger.setContext("Schedule").info("Schedule worker stopped.");
        });
        process.on("SIGINT", async (): Promise<void> => {
            this.stopAll();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGINT sent.");
        });
        process.on("SIGTERM", async (): Promise<void> => {
            this.stopAll();
            Logger.setContext("Schedule").info("Stopping schedule worker, SIGTERM sent.");
        });

        Kernel.registerSchedulers();

        ScheduleLoader.schedulers.forEach((scheduler: TSchedule) => {
            this.scheduleAligned(scheduler);
        });
    }

    private scheduleAligned(task: TSchedule): void {
        const intervalMs: number = task.timer * 1000;

        const scheduleNext = () => {
            const now: number = Date.now();
            const nextRun: number = Math.floor(now / intervalMs) * intervalMs + intervalMs;
            const delay: number = nextRun - now;

            const timeout = setTimeout(() => {
                if (this.running.has(task.command)) return scheduleNext();

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

    private stopAll(): void {
        for (const timeout of this.timeouts.values()) {
            clearTimeout(timeout);
        }

        this.timeouts.clear();
    }
}