import JobBuilder from "@/builders/JobBuilder";
import RuntimeException from "@/exceptions/RuntimeException";

/**
 * Base class every Bejibun queue job extends. Provides namespace
 * registration and a static `dispatch()` shortcut for pushing the
 * job onto its queue.
 */
export default class BaseJob {
    /** The registered namespace/identifier this job is dispatched under. Set via `setNamespace()`. */
    protected static _namespace: string;

    /**
     * The job's registered namespace.
     *
     * @returns {string} The registered namespace.
     * @throws {RuntimeException} If the namespace hasn't been registered via `setNamespace()`.
     */
    public static get namespace(): string {
        if (!this._namespace)
            throw new RuntimeException(`Job namespace not registered for [${this.name}].`);

        return this._namespace;
    }

    /**
     * Registers the namespace/identifier this job is dispatched under.
     * Typically called once by the framework's namespace loader.
     *
     * @param {string} namespace - The namespace to register.
     */
    public static setNamespace(namespace: string): void {
        this._namespace = namespace;
    }

    /**
     * Dispatches this job onto its registered queue.
     *
     * @param {Array<any>} args - Arguments forwarded to the job's handler when it runs.
     * @returns {JobBuilder} A builder for further chaining.
     */
    public static dispatch(...args: any): JobBuilder {
        return new JobBuilder().setQueue(this.namespace).dispatch(...args);
    }
}
