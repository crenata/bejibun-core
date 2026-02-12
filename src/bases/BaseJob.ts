import {isEmpty} from "@bejibun/utils";
import JobBuilder from "@/builders/JobBuilder";
import RuntimeException from "@/exceptions/RuntimeException";

export default class BaseJob {
    protected static _namespace: string;

    public static get namespace(): string {
        if (isEmpty(this._namespace)) throw new RuntimeException(`Job namespace not registered for [${this.name}].`);

        return this._namespace;
    }

    public static setNamespace(namespace: string): void {
        this._namespace = namespace;
    }

    public static dispatch(...args: any): JobBuilder {
        return new JobBuilder().setQueue(this.namespace).dispatch(...args);
    }
}