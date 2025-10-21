import App from "@bejibun/app";
import Response from "../facades/Response";
export default class MaintenanceMiddleware {
    handle(handler) {
        return async (request) => {
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
