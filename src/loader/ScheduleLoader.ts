import type {TSchedule} from "@/types/schedule";

export default class ScheduleLoader {
    public static schedulers: Array<TSchedule> = [];

    public static add(schedule: TSchedule): void {
        ScheduleLoader.schedulers.push(schedule);
    }
}