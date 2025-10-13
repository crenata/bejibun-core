import {defineValue} from "@/utils/utils";

export default class ValidatorException extends Error {
    public code: number;

    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "ValidatorException";
        this.code = defineValue(code, 422);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidatorException);
        }
    }
}