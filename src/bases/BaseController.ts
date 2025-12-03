import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import {errors, VineValidator} from "@vinejs/vine";
import {DateTime} from "luxon";
import ValidatorException from "@/exceptions/ValidatorException";
import Response from "@/facades/Response";

export default class BaseController {
    public async parse(request: Bun.BunRequest): Promise<Record<string, any>> {
        const contentType = defineValue(request.headers.get("content-type"), "");
        const formData = new FormData();

        try {
            if (contentType.includes("application/json")) return await request.json();

            for (const [key, value] of Object.entries(request.params)) {
                formData.append(key, value as string);
            }

            const url = new URL(request.url);
            for (const [key, value] of url.searchParams) {
                formData.append(key, value);
            }

            if (
                contentType.includes("multipart/form-data") ||
                contentType.includes("application/x-www-form-urlencoded")
            ) {
                const body = await request.formData();

                for (const [key, value] of body) {
                    formData.append(key, value);
                }
            }

            const text = await request.text();
            if (isNotEmpty(text)) formData.append("text", text);
        } catch {
            // do nothing
        }

        return this.parseForm(formData);
    }

    public get response(): typeof Response {
        return Response;
    }

    public async validate(validator: VineValidator<any, Record<string, any> | undefined>, body: Record<string, any>): Promise<any> {
        try {
            return await validator.validate(body);
        } catch (error: typeof errors.E_VALIDATION_ERROR | any) {
            throw new ValidatorException(error.messages[0].message);
        }
    }

    private parseForm(formData: FormData): Record<string, any> {
        const result: Record<string, any> = {};

        for (const [key, value] of formData.entries()) {
            const keys = key.replace(/]/g, "").split("[");

            let current: any = result;

            for (let i = 0; i < keys.length; i++) {
                const part = keys[i];
                const nextPart = keys[i + 1];

                if (i === keys.length - 1) {
                    let convertedValue: any;

                    if (value as unknown instanceof File) {
                        convertedValue = value;
                    } else if (value.trim() === "" || value === "null" || value === "undefined") {
                        convertedValue = null;
                    } else if (Number.isNaN(value)) {
                        convertedValue = Number(value);
                    } else if (value === "true" || value === "false") {
                        convertedValue = value === "true";
                    } else {
                        try {
                            convertedValue = JSON.parse(value);
                        } catch {
                            convertedValue = value;
                        }
                    }

                    if (current[part] === undefined) current[part] = convertedValue;
                    else if (Array.isArray(current[part])) current[part].push(convertedValue);
                    else continue;
                } else {
                    const isArrayIndex = /^\d+$/.test(nextPart);

                    if (isEmpty(current[part])) current[part] = isArrayIndex ? [] : {};

                    current = current[part];
                }
            }
        }

        return result;
    }
}