export default class RuntimeException extends Error {
    code: number;
    constructor(message?: string, code?: number | undefined | null, stack?: string);
}
