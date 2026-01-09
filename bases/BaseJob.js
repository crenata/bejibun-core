import JobBuilder from "../builders/JobBuilder";
export default class BaseJob {
    static dispatch(...args) {
        return new JobBuilder().dispatch(...args);
    }
}
