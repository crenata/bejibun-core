import ScheduleLoader from "../loader/ScheduleLoader";
export default class ScheduleBuilder {
    cmd;
    cron;
    tz;
    constructor() {
        this.cmd = "";
        this.cron = "* * * * * *";
    }
    command(command) {
        this.cmd = command;
        return this;
    }
    timezone(timezone) {
        this.tz = timezone;
        return this;
    }
    everySecond() {
        this.cron = "* * * * * *";
        this.push();
    }
    everyTwoSeconds() {
        this.cron = "*/2 * * * * *";
        this.push();
    }
    everyFiveSeconds() {
        this.cron = "*/5 * * * * *";
        this.push();
    }
    everyTenSeconds() {
        this.cron = "*/10 * * * * *";
        this.push();
    }
    everyFifteenSeconds() {
        this.cron = "*/15 * * * * *";
        this.push();
    }
    everyTwentySeconds() {
        this.cron = "*/20 * * * * *";
        this.push();
    }
    everyThirtySeconds() {
        this.cron = "*/30 * * * * *";
        this.push();
    }
    everyMinute() {
        this.cron = "0 * * * * *";
        this.push();
    }
    everyTwoMinutes() {
        this.cron = "0 */2 * * * *";
        this.push();
    }
    everyThreeMinutes() {
        this.cron = "0 */3 * * * *";
        this.push();
    }
    everyFourMinutes() {
        this.cron = "0 */4 * * * *";
        this.push();
    }
    everyFiveMinutes() {
        this.cron = "0 */5 * * * *";
        this.push();
    }
    everyTenMinutes() {
        this.cron = "0 */10 * * * *";
        this.push();
    }
    everyFifteenMinutes() {
        this.cron = "0 */15 * * * *";
        this.push();
    }
    everyThirtyMinutes() {
        this.cron = "0 */30 * * * *";
        this.push();
    }
    hourly() {
        this.cron = "0 0 * * * *";
        this.push();
    }
    hourlyAt(minute) {
        this.cron = `0 ${minute} * * * *`;
        this.push();
    }
    everyOddHour(minute = 0) {
        this.cron = `0 ${minute} 1-23/2 * * *`;
        this.push();
    }
    everyTwoHours(minute = 0) {
        this.cron = `0 ${minute} */2 * * *`;
        this.push();
    }
    everyThreeHours(minute = 0) {
        this.cron = `0 ${minute} */3 * * *`;
        this.push();
    }
    everyFourHours(minute = 0) {
        this.cron = `0 ${minute} */4 * * *`;
        this.push();
    }
    everySixHours(minute = 0) {
        this.cron = `0 ${minute} */6 * * *`;
        this.push();
    }
    daily() {
        this.cron = "0 0 0 * * *";
        this.push();
    }
    dailyAt(time) {
        const { h, m } = this.timeToParts(time);
        this.cron = `0 ${m} ${h} * * *`;
        this.push();
    }
    twiceDaily(h1, h2) {
        this.cron = `0 0 ${h1},${h2} * * *`;
        this.push();
    }
    twiceDailyAt(h1, h2, minute) {
        this.cron = `0 ${minute} ${h1},${h2} * * *`;
        this.push();
    }
    weekly() {
        this.cron = "0 0 0 * * 0";
        this.push();
    }
    weeklyOn(day, time) {
        const { h, m } = this.timeToParts(time);
        this.cron = `0 ${m} ${h} * * ${day}`;
        this.push();
    }
    monthly() {
        this.cron = "0 0 0 1 * *";
        this.push();
    }
    monthlyOn(day, time) {
        const { h, m } = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${day} * *`;
        this.push();
    }
    twiceMonthly(d1, d2, time) {
        const { h, m } = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${d1},${d2} * *`;
        this.push();
    }
    yearly() {
        this.cron = "0 0 0 1 1 *";
        this.push();
    }
    yearlyOn(month, day, time) {
        const { h, m } = this.timeToParts(time);
        this.cron = `0 ${m} ${h} ${day} ${month} *`;
        this.push();
    }
    push() {
        ScheduleLoader.add({
            command: this.cmd,
            cron: this.cron,
            timezone: this.tz
        });
    }
    timeToParts(time) {
        const [h, m] = time.split(":").map(Number);
        return { h, m };
    }
}
