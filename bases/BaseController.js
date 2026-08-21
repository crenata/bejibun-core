import { defineValue, isNotEmpty } from "@bejibun/utils";
import { errors } from "@vinejs/vine";
import ValidatorException from "../exceptions/ValidatorException";
import Response from "../facades/Response";
export default class BaseController {
    get response() {
        return Response;
    }
    async validate(validator, body) {
        try {
            return await validator.validate(body);
        }
        catch (error) {
            let message;
            if (error instanceof errors.E_VALIDATION_ERROR && isNotEmpty(error.messages))
                message = error.messages[0]?.message;
            else
                message = defineValue(error?.message, "Invalid syntax validation.");
            throw new ValidatorException(message);
        }
    }
}
