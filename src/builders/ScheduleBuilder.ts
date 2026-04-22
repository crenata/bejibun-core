import ScheduleLoader from "@/loader/ScheduleLoader";

export default class ScheduleBuilder {
    protected _command: string;
    protected _cron: string;
    protected _timezone: string | undefined;

    public constructor() {
        this._command = "";
        this._cron = "* * * * * *";
    }

    public command(command: string): ScheduleBuilder {
        this._command = command;

        return this;
    }

    public timezone(timezone: string): ScheduleBuilder {
        this._timezone = timezone;

        return this;
    }

    public cron(cron: string): void {
        this._cron = cron;

        this.push();
    }

    public everySecond(): void {
        this._cron = "* * * * * *";

        this.push();
    }

    public everyTwoSeconds(): void {
        this._cron = "*/2 * * * * *";

        this.push();
    }

    public everyFiveSeconds(): void {
        this._cron = "*/5 * * * * *";

        this.push();
    }

    public everyTenSeconds(): void {
        this._cron = "*/10 * * * * *";

        this.push();
    }

    public everyFifteenSeconds(): void {
        this._cron = "*/15 * * * * *";

        this.push();
    }

    public everyTwentySeconds(): void {
        this._cron = "*/20 * * * * *";

        this.push();
    }

    public everyThirtySeconds(): void {
        this._cron = "*/30 * * * * *";

        this.push();
    }

    public everyMinute(): void {
        this._cron = "0 * * * * *";

        this.push();
    }

    public everyTwoMinutes(): void {
        this._cron = "0 */2 * * * *";

        this.push();
    }

    public everyThreeMinutes(): void {
        this._cron = "0 */3 * * * *";

        this.push();
    }

    public everyFourMinutes(): void {
        this._cron = "0 */4 * * * *";

        this.push();
    }

    public everyFiveMinutes(): void {
        this._cron = "0 */5 * * * *";

        this.push();
    }

    public everyTenMinutes(): void {
        this._cron = "0 */10 * * * *";

        this.push();
    }

    public everyFifteenMinutes(): void {
        this._cron = "0 */15 * * * *";

        this.push();
    }

    public everyThirtyMinutes(): void {
        this._cron = "0 */30 * * * *";

        this.push();
    }

    public hourly(): void {
        this._cron = "0 0 * * * *";

        this.push();
    }

    public hourlyAt(minute: number): void {
        this._cron = `0 ${minute} * * * *`;

        this.push();
    }

    public everyOddHour(minute: number = 0): void {
        this._cron = `0 ${minute} 1-23/2 * * *`;

        this.push();
    }

    public everyTwoHours(minute: number = 0): void {
        this._cron = `0 ${minute} */2 * * *`;

        this.push();
    }

    public everyThreeHours(minute: number = 0): void {
        this._cron = `0 ${minute} */3 * * *`;

        this.push();
    }

    public everyFourHours(minute: number = 0): void {
        this._cron = `0 ${minute} */4 * * *`;

        this.push();
    }

    public everySixHours(minute: number = 0): void {
        this._cron = `0 ${minute} */6 * * *`;

        this.push();
    }

    public daily(): void {
        this._cron = "0 0 0 * * *";

        this.push();
    }

    public dailyAt(time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * *`;

        this.push();
    }

    public twiceDaily(h1: number, h2: number): void {
        this._cron = `0 0 ${h1},${h2} * * *`;

        this.push();
    }

    public twiceDailyAt(h1: number, h2: number, minute: number): void {
        this._cron = `0 ${minute} ${h1},${h2} * * *`;

        this.push();
    }

    public weekly(): void {
        this._cron = "0 0 0 * * 0";

        this.push();
    }

    public weeklyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * ${day}`;

        this.push();
    }

    public monthly(): void {
        this._cron = "0 0 0 1 * *";

        this.push();
    }

    public monthlyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} * *`;

        this.push();
    }

    public twiceMonthly(d1: number, d2: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${d1},${d2} * *`;

        this.push();
    }

    public yearly(): void {
        this._cron = "0 0 0 1 1 *";

        this.push();
    }

    public yearlyOn(month: number, day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} ${month} *`;

        this.push();
    }

    private push(): void {
        ScheduleLoader.add({
            command: this._command,
            cron: this._cron,
            timezone: this._timezone
        });
    }

    private timeToParts(time: string): { h: number, m: number } {
        const [h, m] = time.split(":").map(Number);

        return {h, m};
    }
}