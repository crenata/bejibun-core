export default class ModelNotFoundException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
