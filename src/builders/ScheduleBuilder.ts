import ScheduleLoader from "@/loader/ScheduleLoader";

export default class ScheduleBuilder {
    protected _command: string;
    protected timer: number; // minutes

    public constructor() {
        this._command = "";
        this.timer = 60;
    }

    public command(command: string): ScheduleBuilder {
        this._command = command;

        return this;
    }

    public hourly(): void {
        this.timer = 60;

        ScheduleLoader.add({
            command: this._command,
            timer: this.timer
        });
    }
}