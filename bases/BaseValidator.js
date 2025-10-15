import vine from "@vinejs/vine";
import "../utils/vine";
export default class BaseValidator {
    static get validator() {
        return vine;
    }
}
