import ScheduleBuilder from "@/builders/ScheduleBuilder";

export default class Schedule {
    public static command(command: string): ScheduleBuilder {
        return new ScheduleBuilder().command(command);
    }
}
