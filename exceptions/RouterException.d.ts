export default class RouterException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
