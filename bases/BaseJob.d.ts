import JobBuilder from "../builders/JobBuilder";
export default class BaseJob {
    static dispatch(...args: any): JobBuilder;
}
