export default class ValidatorException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
