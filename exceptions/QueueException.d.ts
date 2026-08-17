export default class QueueException extends Error {
    code: number;
    constructor(message?: string, code?: number | undefined | null, stack?: string);
}
