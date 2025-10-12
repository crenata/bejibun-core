import EnumBuilder from "@/builders/EnumBuilder";

export default class Enum {
    public static setEnums(enums: any): EnumBuilder {
        return new EnumBuilder(enums);
    }
}