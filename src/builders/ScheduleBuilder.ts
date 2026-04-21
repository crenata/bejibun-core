import ScheduleLoader from "@/loader/ScheduleLoader";

export default class ScheduleBuilder {
    protected cmd: string;
    protected timer: number; // seconds

    public constructor() {
        this.cmd = "";
        this.timer = 60;
    }

    public command(command: string): ScheduleBuilder {
        this.cmd = command;

        return this;
    }

    public hourly(): void {
        this.timer = 60;

        ScheduleLoader.add({
            command: this.cmd,
            timer: this.timer
        });
    }
}