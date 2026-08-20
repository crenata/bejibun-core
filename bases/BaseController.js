import { defineValue, isNotEmpty } from "@bejibun/utils";
import { default as Bobject } from "@bejibun/utils/facades/Object";
import { errors } from "@vinejs/vine";
import ValidatorException from "../exceptions/ValidatorException";
import Response from "../facades/Response";
export default class BaseController {
    async parse(request) {
        const contentType = defineValue(request.headers.get("content-type"), "");
        const formData = new FormData();
        const data = {};
        try {
            if (contentType.includes("application/json"))
                Object.assign(data, Bobject.serialize(await request.json()));
            for (const [key, value] of Object.entries(request.params)) {
                formData.append(key, value);
            }
            const url = new URL(request.url);
            for (const [key, value] of url.searchParams) {
                formData.append(key, value);
            }
            if (contentType.includes("multipart/form-data") ||
                contentType.includes("application/x-www-form-urlencoded")) {
                const body = await request.formData();
                for (const [key, value] of body) {
                    formData.append(key, value);
                }
            }
            const text = await request.text();
            if (isNotEmpty(text))
                formData.append("text", text);
        }
        catch {
            // do nothing
        }
        return Object.assign(data, Bobject.parseFormData(formData));
    }
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
