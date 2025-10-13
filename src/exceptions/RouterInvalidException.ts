import {defineValue} from "@/utils/utils";

export default class RouterInvalidException extends Error {
    public code: number;

    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "RouterInvalidException";
        this.code = defineValue(code, 500);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RouterInvalidException);
        }
    }
}