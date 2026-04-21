export default class ScheduleBuilder {
    protected cmd: string;
    protected timer: number;
    constructor();
    command(command: string): ScheduleBuilder;
    hourly(): void;
}
