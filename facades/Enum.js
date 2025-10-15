import EnumBuilder from "../builders/EnumBuilder";
export default class Enum {
    static setEnums(enums) {
        return new EnumBuilder(enums);
    }
}
