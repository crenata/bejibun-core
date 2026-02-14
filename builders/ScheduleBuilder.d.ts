export default class ScheduleBuilder {
    protected _command: string;
    protected timer: number;
    constructor();
    command(command: string): ScheduleBuilder;
    hourly(): void;
}
