import ScheduleLoader from "@/loader/ScheduleLoader";

/**
 * Fluent builder used to schedule a recurring command, mirroring Laravel's
 * `Schedule::command(...)->everyMinute()` style API. Every frequency
 * method (`everyMinute`, `daily`, `weeklyOn`, etc.) sets the underlying
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

    public constructor() {
        this._command = "";
        this._cron = "* * * * * *";
    }

    /**
     * Sets the command to run on this schedule.
     *
     * @param command - The shell command to execute.
     * @returns This builder, for chaining.
     */
    public command(command: string): ScheduleBuilder {
        this._command = command;

        return this;
    }

    /**
     * Sets the timezone the cron expression is evaluated in.
     *
     * @param timezone - An IANA timezone name (e.g. `"Asia/Jakarta"`).
     * @returns This builder, for chaining.
     */
    public timezone(timezone: string): ScheduleBuilder {
        this._timezone = timezone;

        return this;
    }

    /**
     * Sets a raw six-field cron expression and registers the schedule.
     *
     * @param cron - The cron expression (`second minute hour day month weekday`).
     */
    public cron(cron: string): void {
        this._cron = cron;

        this.push();
    }

    /** Runs the command every second. */
    public everySecond(): void {
        this._cron = "* * * * * *";

        this.push();
    }

    /** Runs the command every 2 seconds. */
    public everyTwoSeconds(): void {
        this._cron = "*/2 * * * * *";

        this.push();
    }

    /** Runs the command every 5 seconds. */
    public everyFiveSeconds(): void {
        this._cron = "*/5 * * * * *";

        this.push();
    }

    /** Runs the command every 10 seconds. */
    public everyTenSeconds(): void {
        this._cron = "*/10 * * * * *";

        this.push();
    }

    /** Runs the command every 15 seconds. */
    public everyFifteenSeconds(): void {
        this._cron = "*/15 * * * * *";

        this.push();
    }

    /** Runs the command every 20 seconds. */
    public everyTwentySeconds(): void {
        this._cron = "*/20 * * * * *";

        this.push();
    }

    /** Runs the command every 30 seconds. */
    public everyThirtySeconds(): void {
        this._cron = "*/30 * * * * *";

        this.push();
    }

    /** Runs the command every minute, on the minute. */
    public everyMinute(): void {
        this._cron = "0 * * * * *";

        this.push();
    }

    /** Runs the command every 2 minutes. */
    public everyTwoMinutes(): void {
        this._cron = "0 */2 * * * *";

        this.push();
    }

    /** Runs the command every 3 minutes. */
    public everyThreeMinutes(): void {
        this._cron = "0 */3 * * * *";

        this.push();
    }

    /** Runs the command every 4 minutes. */
    public everyFourMinutes(): void {
        this._cron = "0 */4 * * * *";

        this.push();
    }

    /** Runs the command every 5 minutes. */
    public everyFiveMinutes(): void {
        this._cron = "0 */5 * * * *";

        this.push();
    }

    /** Runs the command every 10 minutes. */
    public everyTenMinutes(): void {
        this._cron = "0 */10 * * * *";

        this.push();
    }

    /** Runs the command every 15 minutes. */
    public everyFifteenMinutes(): void {
        this._cron = "0 */15 * * * *";

        this.push();
    }

    /** Runs the command every 30 minutes. */
    public everyThirtyMinutes(): void {
        this._cron = "0 */30 * * * *";

        this.push();
    }

    /** Runs the command every hour, on the hour. */
    public hourly(): void {
        this._cron = "0 0 * * * *";

        this.push();
    }

    /**
     * Runs the command every hour, at the given minute.
     *
     * @param minute - The minute of each hour to run at (0-59).
     */
    public hourlyAt(minute: number): void {
        this._cron = `0 ${minute} * * * *`;

        this.push();
    }

    /**
     * Runs the command every odd hour (1, 3, 5, ...), at the given minute.
     *
     * @param minute - The minute to run at (0-59). Defaults to `0`.
     */
    public everyOddHour(minute: number = 0): void {
        this._cron = `0 ${minute} 1-23/2 * * *`;

        this.push();
    }

    /**
     * Runs the command every 2 hours, at the given minute.
     *
     * @param minute - The minute to run at (0-59). Defaults to `0`.
     */
    public everyTwoHours(minute: number = 0): void {
        this._cron = `0 ${minute} */2 * * *`;

        this.push();
    }

    /**
     * Runs the command every 3 hours, at the given minute.
     *
     * @param minute - The minute to run at (0-59). Defaults to `0`.
     */
    public everyThreeHours(minute: number = 0): void {
        this._cron = `0 ${minute} */3 * * *`;

        this.push();
    }

    /**
     * Runs the command every 4 hours, at the given minute.
     *
     * @param minute - The minute to run at (0-59). Defaults to `0`.
     */
    public everyFourHours(minute: number = 0): void {
        this._cron = `0 ${minute} */4 * * *`;

        this.push();
    }

    /**
     * Runs the command every 6 hours, at the given minute.
     *
     * @param minute - The minute to run at (0-59). Defaults to `0`.
     */
    public everySixHours(minute: number = 0): void {
        this._cron = `0 ${minute} */6 * * *`;

        this.push();
    }

    /** Runs the command daily at midnight. */
    public daily(): void {
        this._cron = "0 0 0 * * *";

        this.push();
    }

    /**
     * Runs the command daily at the given time.
     *
     * @param time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    public dailyAt(time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * *`;

        this.push();
    }

    /**
     * Runs the command twice daily, on the hour, at the given hours.
     *
     * @param h1 - The first hour of the day to run at (0-23).
     * @param h2 - The second hour of the day to run at (0-23).
     */
    public twiceDaily(h1: number, h2: number): void {
        this._cron = `0 0 ${h1},${h2} * * *`;

        this.push();
    }

    /**
     * Runs the command twice daily, at the given hours and minute.
     *
     * @param h1 - The first hour of the day to run at (0-23).
     * @param h2 - The second hour of the day to run at (0-23).
     * @param minute - The minute to run at (0-59).
     */
    public twiceDailyAt(h1: number, h2: number, minute: number): void {
        this._cron = `0 ${minute} ${h1},${h2} * * *`;

        this.push();
    }

    /** Runs the command weekly, at midnight on Sunday. */
    public weekly(): void {
        this._cron = "0 0 0 * * 0";

        this.push();
    }

    /**
     * Runs the command weekly, on the given day and time.
     *
     * @param day - The day of the week to run on (0 = Sunday, ..., 6 = Saturday).
     * @param time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    public weeklyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * ${day}`;

        this.push();
    }

    /** Runs the command monthly, at midnight on the 1st. */
    public monthly(): void {
        this._cron = "0 0 0 1 * *";

        this.push();
    }

    /**
     * Runs the command monthly, on the given day and time.
     *
     * @param day - The day of the month to run on (1-31).
     * @param time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    public monthlyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} * *`;

        this.push();
    }

    /**
     * Runs the command twice monthly, on the given days and time.
     *
     * @param d1 - The first day of the month to run on (1-31).
     * @param d2 - The second day of the month to run on (1-31).
     * @param time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    public twiceMonthly(d1: number, d2: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${d1},${d2} * *`;

        this.push();
    }

    /** Runs the command yearly, at midnight on January 1st. */
    public yearly(): void {
        this._cron = "0 0 0 1 1 *";

        this.push();
    }

    /**
     * Runs the command yearly, on the given month, day, and time.
     *
     * @param month - The month to run in (1-12).
     * @param day - The day of the month to run on (1-31).
     * @param time - The time to run at, in `"HH:mm"` 24-hour format.
     */
    public yearlyOn(month: number, day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} ${month} *`;

        this.push();
    }

    /**
     * Registers this schedule's current command/cron/timezone with the
     * `ScheduleLoader`. Called automatically by every frequency method.
     */
    private push(): void {
        ScheduleLoader.add({
            command: this._command,
            cron: this._cron,
            timezone: this._timezone
        });
    }

    /**
     * Parses an `"HH:mm"` time string into its hour and minute components.
     *
     * @param time - The time string to parse.
     * @returns The parsed hour (`h`) and minute (`m`).
     */
    private timeToParts(time: string): {h: number; m: number} {
        const [h, m] = time.split(":").map(Number);

        return {h, m};
    }
}
