import Luxon from "@bejibun/utils/facades/Luxon";
import JobModel from "@/models/JobModel";

export default class JobBuilder {
    protected queue?: string;
    protected now: number;
    protected availableAt: number;
    protected args: Array<any>;

    public constructor() {
        this.now = Luxon.DateTime.now().toUnixInteger();
        this.availableAt = this.now;
        this.args = [];
    }

    public setQueue(queue: string): JobBuilder {
        this.queue = queue;

        return this;
    }

    public dispatch(...args: any): JobBuilder {
        this.args.push(...args);

        return this;
    }

    public delay(delay: number): JobBuilder {
        this.availableAt = this.now + delay;

        return this;
    }

    public async send(): Promise<void> {
        await JobModel.create({
            queue: this.queue,
            payload: JSON.stringify(this.args),
            available_at: this.availableAt,
            created_at: this.now
        });
    }
}