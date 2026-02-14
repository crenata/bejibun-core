import ScheduleLoader from "../loader/ScheduleLoader";
export default class ScheduleBuilder {
    _command;
    timer; // minutes
    constructor() {
        this._command = "";
        this.timer = 60;
    }
    command(command) {
        this._command = command;
        return this;
    }
    hourly() {
        this.timer = 60;
        ScheduleLoader.add({
            command: this._command,
            timer: this.timer
        });
    }
}
