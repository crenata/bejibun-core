/**
 * Registry of scheduled (cron-driven) tasks, populated by
 * `ScheduleBuilder` as an application's `Kernel.schedule()` runs, and
 * consumed by the schedule worker command to determine what's due to run.
 */
export default class ScheduleLoader {
    /** Every registered scheduled task. */
    static schedulers = [];
    /**
     * Registers a scheduled task.
     *
     * @param {TSchedule} schedule - The schedule descriptor to register.
     */
    static add(schedule) {
        ScheduleLoader.schedulers.push(schedule);
    }
}
