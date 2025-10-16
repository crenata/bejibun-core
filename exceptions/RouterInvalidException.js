import { defineValue } from "@bejibun/utils";
export default class RouterInvalidException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "RouterInvalidException";
        this.code = defineValue(code, 500);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RouterInvalidException);
        }
    }
}
