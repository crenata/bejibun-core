import type { TSchedule } from "../types/schedule";
export default class ScheduleLoader {
    static schedulers: Array<TSchedule>;
    static add(schedule: TSchedule): void;
}
