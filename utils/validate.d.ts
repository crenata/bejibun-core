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
export declare function validatePayload(validator: Bejibun.Validator, body: Record<string, any>): Promise<any>;
