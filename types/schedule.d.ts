/**
 * Descriptor for a single scheduled (cron-driven) task, as produced by
 * `ScheduleBuilder` and consumed by `ScheduleLoader`/the scheduler worker.
 */
export type TSchedule = {
    /** The Ace command to run (e.g. `"queue:flush"`). */
    command: string;

    /** The cron expression controlling when the command runs. */
    cron: string;

    /** The IANA timezone the cron expression is evaluated in, or `undefined` for the system default. */
    timezone: string | undefined;
};
