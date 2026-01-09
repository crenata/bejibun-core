import Luxon from "@bejibun/utils/facades/Luxon";
import JobModel from "../models/JobModel";
export default class JobBuilder {
    now;
    availableAt;
    args;
    constructor() {
        this.now = Luxon.DateTime.now().toUnixInteger();
        this.availableAt = this.now;
        this.args = [];
    }
    dispatch(...args) {
        this.args.push(...args);
        return this;
    }
    delay(delay) {
        this.availableAt = this.now + delay;
        return this;
    }
    async send() {
        await JobModel.create({
            queue: Bun.randomUUIDv7(),
            payload: JSON.stringify(this.args),
            available_at: this.availableAt,
            created_at: this.now
        });
    }
}
