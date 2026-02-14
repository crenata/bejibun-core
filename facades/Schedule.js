import ScheduleBuilder from "../builders/ScheduleBuilder";
export default class Schedule {
    static command(command) {
        return new ScheduleBuilder().command(command);
    }
}
