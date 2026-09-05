/**
 * Fluent builder for scheduling recurring commands. Supports
 * six-field cron expression (`second minute hour day month weekday`) and
 * immediately registers the schedule entry with `ScheduleLoader`.
 */
export default class ScheduleBuilder {
    /** The shell command to run on this schedule. */
    protected _command: string;
    /** The six-field cron expression controlling when the command runs. */
    protected _cron: string;
    /** Optional IANA timezone the cron expression is evaluated in. */
    protected _timezone: string | undefined;
    constructor();
    /**
     * Sets the command to run on this schedule.
     *
     * @param {string} command - The shell command to execute.
     * @returns {ScheduleBuilder} This builder, for chaining.
     */
    command(command: string): ScheduleBuilder;
    /**
     * Sets the timezone the cron expression is evaluated in.
     *
     * @param {string} timezone - An IANA timezone name (e.g. `"Asia/Jakarta"`).
     * @returns {ScheduleBuilder} This builder, for chaining.
     */
    timezone(timezone: string): ScheduleBuilder;
    /**
     * Sets a raw six-field cron expression and registers the schedule.
     *
     * @param {string} cron - The cron expression (`second minute hour day month weekday`).
     */
    cron(cron: string): void;
    /** Runs the command every second. */
    everySecond(): void;
    /** Runs the command every 2 seconds. */
    everyTwoSeconds(): void;
    /** Runs the command every 5 seconds. */
    everyFiveSeconds(): void;
    /** Runs the command every 10 seconds. */
    everyTenSeconds(): void;
    /** Runs the command every 15 seconds. */
    everyFifteenSeconds(): void;
    /** Runs the command every 20 seconds. */
    everyTwentySeconds(): void;
    /** Runs the command every 30 seconds. */
    everyThirtySeconds(): void;
    /** Runs the command every minute, on the minute. */
    everyMinute(): void;
    /** Runs the command every 2 minutes. */
    everyTwoMinutes(): void;
    /** Runs the command every 3 minutes. */
    everyThreeMinutes(): void;
    /** Runs the command every 4 minutes. */
    everyFourMinutes(): void;
    /** Runs the command every 5 minutes. */
    everyFiveMinutes(): void;
    /** Runs the command every 10 minutes. */
    everyTenMinutes(): void;
    /** Runs the command every 15 minutes. */
    everyFifteenMinutes(): void;
    /** Runs the command every 30 minutes. */
    everyThirtyMinutes(): void;
    /** Runs the command every hour, on the hour. */
    hourly(): void;
    /**
     * Runs the command every hour, at the given minute.
     *
     * @param {number} minute - The minute of each hour to run at (0-59).
     */
    hourlyAt(minute: number): void;
    /**
     * Runs the command every odd hour (1, 3, 5, ...), at the given minute.
     *
     * @param {number} minute - The minute to run at (0-59). Defaults to `0`.
     */
    everyOddHour(minute?: number): void;
    /**
     * Runs the command every 2 hours, at the given minute.
     *
     * @param {number} minute - The minute to run at (0-59). Defaults to `0`.
     */
    everyTwoHours(minute?: number): void;
    /**
     * Runs the command every 3 hours, at the given minute.
     *
     * @param {number} minute - The minute to run at (0-59). Defaults to `0`.
     */
    everyThreeHours(minute?: number): void;
    /**
     * Runs the command every 4 hours, at the given minute.
     *
     * @param {number} minute - The minute to run at (0-59). Defaults to `0`.
     */
    everyFourHours(minute?: number): void;
    /**
     * Runs the command every 6 hours, at the given minute.
     *
     * @param {number} minute - The minute to run at (0-59). Defaults to `0`.
     */
    everySixHours(minute?: number): void;
    /** Runs the command daily at midnight. */
    daily(): void;
    /**
     * Runs the command daily at the given time.
     *
     * @param {string} time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    dailyAt(time: string): void;
    /**
     * Runs the command twice daily, on the hour, at the given hours.
     *
     * @param {number} h1 - The first hour of the day to run at (0-23).
     * @param {number} h2 - The second hour of the day to run at (0-23).
     */
    twiceDaily(h1: number, h2: number): void;
    /**
     * Runs the command twice daily, at the given hours and minute.
     *
     * @param {number} h1 - The first hour of the day to run at (0-23).
     * @param {number} h2 - The second hour of the day to run at (0-23).
     * @param {number} minute - The minute to run at (0-59).
     */
    twiceDailyAt(h1: number, h2: number, minute: number): void;
    /** Runs the command weekly, at midnight on Sunday. */
    weekly(): void;
    /**
     * Runs the command weekly, on the given day and time.
     *
     * @param {number} day - The day of the week to run on (0 = Sunday, ..., 6 = Saturday).
     * @param {string} time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    weeklyOn(day: number, time: string): void;
    /** Runs the command monthly, at midnight on the 1st. */
    monthly(): void;
    /**
     * Runs the command monthly, on the given day and time.
     *
     * @param {number} day - The day of the month to run on (1-31).
     * @param {string} time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    monthlyOn(day: number, time: string): void;
    /**
     * Runs the command twice monthly, on the given days and time.
     *
     * @param {number} d1 - The first day of the month to run on (1-31).
     * @param {number} d2 - The second day of the month to run on (1-31).
     * @param {string} time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    twiceMonthly(d1: number, d2: number, time: string): void;
    /** Runs the command yearly, at midnight on January 1st. */
    yearly(): void;
    /**
     * Runs the command yearly, on the given month, day, and time.
     *
     * @param {number} month - The month to run in (1-12).
     * @param {number} day - The day of the month to run on (1-31).
     * @param {string} time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    yearlyOn(month: number, day: number, time: string): void;
    /**
     * Registers this schedule's current command/cron/timezone with the
     * `ScheduleLoader`. Called automatically by every frequency method.
     */
    private push;
    /**
     * Parses an `"HH:mm"` time string into its hour and minute components.
     *
     * @param {string} time - The time string to parse.
     * @returns {{h: number; m: number}} The parsed hour (`h`) and minute (`m`).
     */
    private timeToParts;
}
