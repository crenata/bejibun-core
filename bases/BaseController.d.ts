import { VineValidator } from "@vinejs/vine";
import Response from "../facades/Response";
export default class BaseController {
    get response(): typeof Response;
    validate(validator: VineValidator<any, Record<string, any> | undefined>, body: Record<string, any>): Promise<any>;
}
