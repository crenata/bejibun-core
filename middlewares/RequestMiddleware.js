import { defineValue, isNotEmpty } from "@bejibun/utils";
export default class RequestMiddleware {
    handle(handler) {
        return async (request, server) => {
            const contentType = defineValue(request.headers.get("content-type"), "");
            const payload = {};
            try {
                if (contentType.includes("application/json"))
                    Object.assign(payload, await request.json());
                for (const [key, value] of Object.entries(request.params)) {
                    payload[key] = value;
                }
                const url = new URL(request.url);
                for (const [key, value] of url.searchParams) {
                    payload[key] = value;
                }
                if (contentType.includes("multipart/form-data") ||
                    contentType.includes("application/x-www-form-urlencoded")) {
                    const body = await request.formData();
                    for (const [key, value] of body) {
                        payload[key] = value;
                    }
                }
                const text = await request.text();
                if (isNotEmpty(text))
                    payload.plainText = text;
            }
            catch {
                // do nothing
            }
            request.payload = payload;
            return handler(request, server);
        };
    }
}
