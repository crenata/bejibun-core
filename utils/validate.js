import { defineValue, isNotEmpty } from "@bejibun/utils";
import { errors } from "@vinejs/vine";
import ValidatorException from "../exceptions/ValidatorException";
/**
 * Runs a Vine validator against the given body, normalizing any
 * validation failure into a `ValidatorException`.
 *
 * Shared by `BaseController.validate()` and `Bejibun.Request.validate()`
 * so both entry points behave identically.
 *
 * @param validator - The Vine validator to run.
 * @param body - The data to validate.
 * @returns The validated (and type-coerced) data.
 * @throws {ValidatorException} When validation fails.
 */
export async function validatePayload(validator, body) {
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
