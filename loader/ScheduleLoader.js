export default class ScheduleLoader {
    static schedulers = [];
    static add(schedule) {
        ScheduleLoader.schedulers.push(schedule);
    }
}
