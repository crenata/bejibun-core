import ScheduleLoader from "../loader/ScheduleLoader";
export default class ScheduleBuilder {
    cmd;
    timer; // seconds
    constructor() {
        this.cmd = "";
        this.timer = 60;
    }
    command(command) {
        this.cmd = command;
        return this;
    }
    hourly() {
        this.timer = 60;
        ScheduleLoader.add({
            command: this.cmd,
            timer: this.timer
        });
    }
}
