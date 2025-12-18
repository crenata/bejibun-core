export default class DiskException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
