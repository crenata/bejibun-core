import { VineValidator } from "@vinejs/vine";
import { BunRequest } from "bun";
import Response from "../facades/Response";
export default class BaseController {
    parse(request: BunRequest): Promise<Record<string, any>>;
    get response(): typeof Response;
    validate(validator: VineValidator<any, Record<string, any> | undefined>, body: Record<string, any>): Promise<any>;
    private serialize;
    private parseForm;
}
