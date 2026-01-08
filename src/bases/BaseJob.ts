import Luxon from "@bejibun/utils/facades/Luxon";
import JobModel from "@/models/JobModel";

export default class BaseJob {
    protected now: number = Luxon.DateTime.now().toUnixInteger();
    protected availableAt: number = this.now;
    protected args: Array<any> = [];

    public dispatch(...args: any): BaseJob {
        this.args.push(...args);

        return this;
    }

    public delay(delay: number): BaseJob {
        this.availableAt = this.now + delay;

        return this;
    }

    public async send(): Promise<void> {
        await JobModel.create({
            queue: Bun.randomUUIDv7(),
            payload: JSON.stringify(this.args),
            available_at: this.availableAt,
            created_at: this.now
        });
    }
}