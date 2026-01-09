import JobBuilder from "@/builders/JobBuilder";

export default class BaseJob {
    public static dispatch(...args: any): JobBuilder {
        return new JobBuilder().dispatch(...args);
    }
}