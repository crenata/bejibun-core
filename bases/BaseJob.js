import { isEmpty } from "@bejibun/utils";
import JobBuilder from "../builders/JobBuilder";
import RuntimeException from "../exceptions/RuntimeException";
export default class BaseJob {
    static _namespace;
    static get namespace() {
        if (isEmpty(this._namespace))
            throw new RuntimeException(`Job namespace not registered for [${this.name}].`);
        return this._namespace;
    }
    static setNamespace(namespace) {
        this._namespace = namespace;
    }
    static dispatch(...args) {
        return new JobBuilder().setQueue(this.namespace).dispatch(...args);
    }
}
