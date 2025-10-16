import { defineValue } from "@bejibun/utils";
export default class ValidatorException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "ValidatorException";
        this.code = defineValue(code, 422);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidatorException);
        }
    }
}
