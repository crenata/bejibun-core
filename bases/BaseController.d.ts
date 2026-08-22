import Response from "../facades/Response";
export default class BaseController {
    get response(): typeof Response;
}
