export default class JobBuilder {
    protected queue?: string;
    protected now: number;
    protected availableAt: number;
    protected args: Array<any>;
    constructor();
    setQueue(queue: string): JobBuilder;
    dispatch(...args: any): JobBuilder;
    delay(delay: number): JobBuilder;
    send(): Promise<void>;
}
