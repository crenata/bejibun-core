import EnumBuilder from "@/builders/EnumBuilder";
import type {EnumItem} from "@/builders/EnumBuilder";

export type {EnumItem};

export default class Enum {
    public static setEnums(enums: any): EnumBuilder {
        return new EnumBuilder(enums);
    }
}