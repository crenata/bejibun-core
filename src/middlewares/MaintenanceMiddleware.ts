import type {HandlerType} from "@/types/router";
import App from "@bejibun/app";
import Response from "@/facades/Response";

export default class MaintenanceMiddleware {
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest) => {
            if (await App.Maintenance.isMaintenanceMode()) {
                const maintenance = await App.Maintenance.getData();

                return Response
                    .setMessage(maintenance.message)
                    .setStatus(maintenance.status)
                    .send();
            }

            return handler(request);
        };
    }
}