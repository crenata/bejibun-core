import { VineValidator } from "@vinejs/vine";
import Response from "../facades/Response";
export default class BaseController {
    parse(request: Bun.BunRequest): Promise<Record<string, any>>;
    get response(): typeof Response;
    validate(validator: VineValidator<any, Record<string, any> | undefined>, body: Record<string, any>): Promise<any>;
}
