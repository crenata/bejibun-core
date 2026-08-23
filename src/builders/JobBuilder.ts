import Luxon from "@bejibun/utils/facades/Luxon";
import JobModel from "@/models/JobModel";

/**
 * Fluent builder used to configure and dispatch a queue job. Persists the
 * job as a row in `JobModel` (queue name, serialized arguments, and the
 * unix timestamp it becomes available at) for the queue worker to pick up.
 */
export default class JobBuilder {
    /** The queue name this job will be pushed onto. */
    protected queue?: string;

    /** The unix timestamp this builder was created at. */
    protected now: number;

    /** The unix timestamp the job becomes eligible to run at (defaults to `now`, shifted by `delay()`). */
    protected availableAt: number;

    /** The arguments to pass to the job's handler when it runs. */
    protected args: Array<any>;

    public constructor() {
        this.now = Luxon.DateTime.now().toUnixInteger();
        this.availableAt = this.now;
        this.args = [];
    }

    /**
     * Sets the queue this job will be dispatched onto.
     *
     * @param queue - The queue name/namespace.
     * @returns This builder, for chaining.
     */
    public setQueue(queue: string): JobBuilder {
        this.queue = queue;

        return this;
    }

    /**
     * Adds arguments to be forwarded to the job's handler when it runs.
     *
     * @param args - The arguments to store.
     * @returns This builder, for chaining.
     */
    public dispatch(...args: any): JobBuilder {
        this.args.push(...args);

        return this;
    }

    /**
     * Delays the job's availability by the given number of seconds from now.
     *
     * @param delay - The delay, in seconds.
     * @returns This builder, for chaining.
     */
    public delay(delay: number): JobBuilder {
        this.availableAt = this.now + delay;

        return this;
    }

    /**
     * Persists the job to the queue table so a worker can pick it up.
     */
    public async send(): Promise<void> {
        await JobModel.create({
            queue: this.queue,
            payload: JSON.stringify(this.args),
            available_at: this.availableAt,
            created_at: this.now
        });
    }
}
