import vine from "@vinejs/vine";
import "@/utils/vine";

export default class BaseValidator {
    public static get validator(): typeof vine {
        return vine;
    }
}