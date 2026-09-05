import BaseJob from "@bejibun/core/bases/BaseJob";

/**
 * Template stub for creating new queued jobs.
 * Extend this class and fill in the `handle()` method with your job logic.
 */
export default class TemplateJob extends BaseJob {
    /**
     * Execute the job.
     *
     * @var $arguments Array<any>
     */
    public async handle(args: Array<any>): Promise<void> {
        // Your code goes here
    }
}
