import Response from "@/facades/Response";

export default class BaseController {
    public get response(): typeof Response {
        return Response;
    }
}
