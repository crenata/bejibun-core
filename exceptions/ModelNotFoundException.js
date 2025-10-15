import { defineValue } from "../utils/utils";
export default class ModelNotFoundException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "ModelNotFoundException";
        this.code = defineValue(code, 404);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ModelNotFoundException);
        }
    }
}
