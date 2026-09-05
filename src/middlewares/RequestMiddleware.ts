import type {HandlerType} from "@/types/router";

/**
 * Middleware that parses the incoming request body/query/route params
 * into a single flat `request.payload` map, which every accessor attached
 * by `RouterBuilder.attachRequestHelpers()` (`get`, `input`, `all`,
 * `only`, `validate`, etc.) reads from.
 *
 * Applied globally in `server.ts` (ahead of the application's routes), so
 * every route handler can rely on `request.payload` being populated by
 * the time it runs.
 *
 * Merge order (later sources overwrite earlier ones on key collision):
 * 1. Parsed JSON body (`Content-Type: application/json`)
 * 2. Route params (`request.params`)
 * 3. URL query string params
 * 4. Parsed form data (`multipart/form-data` or `application/x-www-form-urlencoded`) - including uploaded `File` values
 * 5. Raw request body text, stored under the `plainText` key
 *
 * Any parsing failure is swallowed silently, leaving `payload` as whatever
 * data is successfully collected before the error.
 */
export default class RequestMiddleware {
    /**
     * Wraps the handler so `request.payload` is populated before it runs.
     *
     * @param {HandlerType} handler - The handler to wrap.
     * @returns {HandlerType} The payload-populating handler.
     */
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bejibun.Request, server: Bun.Server<any>) => {
            const contentType: string = request.headers.get("content-type") ?? "";

            const payload: Record<string, any> = {};

            const isJson = contentType.includes("application/json");
            const isForm =
                contentType.includes("multipart/form-data") ||
                contentType.includes("application/x-www-form-urlencoded");

            try {
                if (isJson) Object.assign(payload, await request.json());

                for (const [key, value] of Object.entries(request.params)) {
                    payload[key] = value;
                }

                const url = new URL(request.url);
                for (const [key, value] of url.searchParams) {
                    payload[key] = value;
                }

                if (isForm) {
                    const body = await request.formData();

                    for (const [key, value] of body) {
                        payload[key] = value;
                    }
                }

                if (!isJson && !isForm) {
                    const text = await request.text();
                    if (text) payload.plainText = text;
                }
            } catch {
                // do nothing
            }

            request.payload = payload;

            return handler(request, server);
        };
    }
}
