import ScheduleLoader from "@/loader/ScheduleLoader";

export default class ScheduleBuilder {
    protected cmd: string;
    protected cron: string;
    protected tz: string | undefined;

    public constructor() {
        this.cmd = "";
        this.cron = "* * * * * *";
    }

    public command(command: string): ScheduleBuilder {
        this.cmd = command;

        return this;
    }

    public timezone(timezone: string): ScheduleBuilder {
        this.tz = timezone;

        return this;
    }

    public everySecond(): void {
        this.cron = "* * * * * *";

        this.push();
    }

    public everyTwoSeconds(): void {
        this.cron = "*/2 * * * * *";

        this.push();
    }

    public everyFiveSeconds(): void {
        this.cron = "*/5 * * * * *";

        this.push();
    }

    public everyTenSeconds(): void {
        this.cron = "*/10 * * * * *";

        this.push();
    }

    public everyFifteenSeconds(): void {
        this.cron = "*/15 * * * * *";

        this.push();
    }

    public everyTwentySeconds(): void {
        this.cron = "*/20 * * * * *";

        this.push();
    }

    public everyThirtySeconds(): void {
        this.cron = "*/30 * * * * *";

        this.push();
    }

    public everyMinute(): void {
        this.cron = "0 * * * * *";

        this.push();
    }

    public everyTwoMinutes(): void {
        this.cron = "0 */2 * * * *";

        this.push();
    }

    public everyThreeMinutes(): void {
        this.cron = "0 */3 * * * *";

        this.push();
    }

    public everyFourMinutes(): void {
        this.cron = "0 */4 * * * *";

        this.push();
    }

    public everyFiveMinutes(): void {
        this.cron = "0 */5 * * * *";

        this.push();
    }

    public everyTenMinutes(): void {
        this.cron = "0 */10 * * * *";

        this.push();
    }

    public everyFifteenMinutes(): void {
        this.cron = "0 */15 * * * *";

        this.push();
    }

    public everyThirtyMinutes(): void {
        this.cron = "0 */30 * * * *";

        this.push();
    }

    public hourly(): void {
        this.cron = "0 0 * * * *";

        this.push();
    }

    public hourlyAt(minute: number): void {
        this.cron = `0 ${minute} * * * *`;

        this.push();
    }

    public everyOddHour(minute: number = 0): void {
        this.cron = `0 ${minute} 1-23/2 * * *`;

        this.push();
    }

    public everyTwoHours(minute: number = 0): void {
        this.cron = `0 ${minute} */2 * * *`;

        this.push();
    }

    public everyThreeHours(minute: number = 0): void {
        this.cron = `0 ${minute} */3 * * *`;

        this.push();
    }

    public everyFourHours(minute: number = 0): void {
        this.cron = `0 ${minute} */4 * * *`;

        this.push();
    }

    public everySixHours(minute: number = 0): void {
        this.cron = `0 ${minute} */6 * * *`;

        this.push();
    }

    public daily(): void {
        this.cron = "0 0 0 * * *";

        this.push();
    }

    public dailyAt(time: string): void {
        const {h, m} = this.timeToParts(time);
        this.cron = `0 ${m} ${h} * * *`;

        this.push();
    }

    public twiceDaily(h1: number, h2: number): void {
        this.cron = `0 0 ${h1},${h2} * * *`;

        this.push();
    }

    public twiceDailyAt(h1: number, h2: number, minute: number): void {
        this.cron = `0 ${minute} ${h1},${h2} * * *`;

        this.push();
    }

    public weekly(): void {
        this.cron = "0 0 0 * * 0";

        this.push();
    }

    public weeklyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this.cron = `0 ${m} ${h} * * ${day}`;

        this.push();
    }

    public monthly(): void {
        this.cron = "0 0 0 1 * *";

        this.push();
    }

    public monthlyOn(day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${day} * *`;

        this.push();
    }

    public twiceMonthly(d1: number, d2: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${d1},${d2} * *`;

        this.push();
    }

    public yearly(): void {
        this.cron = "0 0 0 1 1 *";

        this.push();
    }

    public yearlyOn(month: number, day: number, time: string): void {
        const {h, m} = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${day} ${month} *`;

        this.push();
    }

    private push(): void {
        ScheduleLoader.add({
            command: this.cmd,
            cron: this.cron,
            timezone: this.tz
        });
    }

    private timeToParts(time: string): { h: number, m: number } {
        const [h, m] = time.split(":").map(Number);

        return {h, m};
    }
}