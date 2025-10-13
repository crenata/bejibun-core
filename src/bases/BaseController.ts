import {VineValidator} from "@vinejs/vine";
import {BunRequest} from "bun";
import Response from "@/facades/Response";
import {defineValue, isNotEmpty} from "@/utils/utils";

export default class BaseController {
    public async parse(request: BunRequest): Promise<FormData> {
        const contentType = defineValue(request.headers.get("content-type"), "");
        const formData = new FormData();

        try {
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

            if (contentType.includes("application/json")) {
                const json = await request.json();

                for (const key in json) {
                    if (Object.hasOwnProperty.call(json, key)) {
                        formData.append(key, json[key]);
                    }
                }
            }

            const text = await request.text();
            if (isNotEmpty(text)) formData.append("text", text);
        } catch (e) {
            // do nothing
        }

        return formData;
    }

    public get response(): typeof Response {
        return Response;
    }

    public async validate(validator: VineValidator<any, Record<string, any> | undefined>, body: FormData): Promise<any> {
        return await validator.validate(Object.fromEntries(body.entries()));
    }
}