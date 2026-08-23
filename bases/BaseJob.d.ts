import JobBuilder from "../builders/JobBuilder";
/**
 * Base class every Bejibun queue job extends. Provides namespace
 * registration (used to resolve the job class back from the queue driver)
 * and a static `dispatch()` shortcut for pushing the job onto its queue.
 */
export default class BaseJob {
    /** The registered namespace/identifier this job is dispatched under. Set via `setNamespace()`. */
    protected static _namespace: string;
    /**
     * The job's registered namespace.
     *
     * @throws {RuntimeException} If the namespace hasn't been registered via `setNamespace()`.
     */
    static get namespace(): string;
    /**
     * Registers the namespace/identifier this job is dispatched under.
     * Typically called once by the framework's namespace loader.
     *
     * @param namespace - The namespace to register.
     */
    static setNamespace(namespace: string): void;
    /**
     * Dispatches this job onto its registered queue.
     *
     * @param args - Arguments forwarded to the job's handler when it runs.
     * @returns A `JobBuilder` for further chaining (e.g. delay, connection).
     */
    static dispatch(...args: any): JobBuilder;
}
