export default class JobBuilder {
    protected now: number;
    protected availableAt: number;
    protected args: Array<any>;
    constructor();
    dispatch(...args: any): JobBuilder;
    delay(delay: number): JobBuilder;
    send(): Promise<void>;
}
