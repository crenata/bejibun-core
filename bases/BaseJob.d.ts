import JobBuilder from "../builders/JobBuilder";
export default class BaseJob {
    protected static _namespace: string;
    static get namespace(): string;
    static setNamespace(namespace: string): void;
    static dispatch(...args: any): JobBuilder;
}
