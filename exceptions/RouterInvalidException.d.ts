export default class RouterInvalidException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
