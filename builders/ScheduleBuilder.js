import ScheduleLoader from "../loader/ScheduleLoader";
export default class ScheduleBuilder {
    _command;
    _cron;
    _timezone;
    constructor() {
        this._command = "";
        this._cron = "* * * * * *";
    }
    command(command) {
        this._command = command;
        return this;
    }
    timezone(timezone) {
        this._timezone = timezone;
        return this;
    }
    cron(cron) {
        this._cron = cron;
        this.push();
    }
    everySecond() {
        this._cron = "* * * * * *";
        this.push();
    }
    everyTwoSeconds() {
        this._cron = "*/2 * * * * *";
        this.push();
    }
    everyFiveSeconds() {
        this._cron = "*/5 * * * * *";
        this.push();
    }
    everyTenSeconds() {
        this._cron = "*/10 * * * * *";
        this.push();
    }
    everyFifteenSeconds() {
        this._cron = "*/15 * * * * *";
        this.push();
    }
    everyTwentySeconds() {
        this._cron = "*/20 * * * * *";
        this.push();
    }
    everyThirtySeconds() {
        this._cron = "*/30 * * * * *";
        this.push();
    }
    everyMinute() {
        this._cron = "0 * * * * *";
        this.push();
    }
    everyTwoMinutes() {
        this._cron = "0 */2 * * * *";
        this.push();
    }
    everyThreeMinutes() {
        this._cron = "0 */3 * * * *";
        this.push();
    }
    everyFourMinutes() {
        this._cron = "0 */4 * * * *";
        this.push();
    }
    everyFiveMinutes() {
        this._cron = "0 */5 * * * *";
        this.push();
    }
    everyTenMinutes() {
        this._cron = "0 */10 * * * *";
        this.push();
    }
    everyFifteenMinutes() {
        this._cron = "0 */15 * * * *";
        this.push();
    }
    everyThirtyMinutes() {
        this._cron = "0 */30 * * * *";
        this.push();
    }
    hourly() {
        this._cron = "0 0 * * * *";
        this.push();
    }
    hourlyAt(minute) {
        this._cron = `0 ${minute} * * * *`;
        this.push();
    }
    everyOddHour(minute = 0) {
        this._cron = `0 ${minute} 1-23/2 * * *`;
        this.push();
    }
    everyTwoHours(minute = 0) {
        this._cron = `0 ${minute} */2 * * *`;
        this.push();
    }
    everyThreeHours(minute = 0) {
        this._cron = `0 ${minute} */3 * * *`;
        this.push();
    }
    everyFourHours(minute = 0) {
        this._cron = `0 ${minute} */4 * * *`;
        this.push();
    }
    everySixHours(minute = 0) {
        this._cron = `0 ${minute} */6 * * *`;
        this.push();
    }
    daily() {
        this._cron = "0 0 0 * * *";
        this.push();
    }
    dailyAt(time) {
        const { h, m } = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * *`;
        this.push();
    }
    twiceDaily(h1, h2) {
        this._cron = `0 0 ${h1},${h2} * * *`;
        this.push();
    }
    twiceDailyAt(h1, h2, minute) {
        this._cron = `0 ${minute} ${h1},${h2} * * *`;
        this.push();
    }
    weekly() {
        this._cron = "0 0 0 * * 0";
        this.push();
    }
    weeklyOn(day, time) {
        const { h, m } = this.timeToParts(time);
        this._cron = `0 ${m} ${h} * * ${day}`;
        this.push();
    }
    monthly() {
        this._cron = "0 0 0 1 * *";
        this.push();
    }
    monthlyOn(day, time) {
        const { h, m } = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} * *`;
        this.push();
    }
    twiceMonthly(d1, d2, time) {
        const { h, m } = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${d1},${d2} * *`;
        this.push();
    }
    yearly() {
        this._cron = "0 0 0 1 1 *";
        this.push();
    }
    yearlyOn(month, day, time) {
        const { h, m } = this.timeToParts(time);
        this._cron = `0 ${m} ${h} ${day} ${month} *`;
        this.push();
    }
    push() {
        ScheduleLoader.add({
            command: this._command,
            cron: this._cron,
            timezone: this._timezone
        });
    }
    timeToParts(time) {
        const [h, m] = time.split(":").map(Number);
        return { h, m };
    }
}
