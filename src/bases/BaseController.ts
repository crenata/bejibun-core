import {defineValue, isNotEmpty} from "@bejibun/utils";
import {errors, VineValidator} from "@vinejs/vine";
import ValidatorException from "@/exceptions/ValidatorException";
import Response from "@/facades/Response";

export default class BaseController {
    public get response(): typeof Response {
        return Response;
    }

    public async validate(
        validator: VineValidator<any, Record<string, any> | undefined>,
        body: Record<string, any>
    ): Promise<any> {
        try {
            return await validator.validate(body);
        } catch (error: any) {
            let message: string;

            if (error instanceof errors.E_VALIDATION_ERROR && isNotEmpty(error.messages))
                message = error.messages[0]?.message;
            else message = defineValue(error?.message, "Invalid syntax validation.");

            throw new ValidatorException(message);
        }
    }
}
