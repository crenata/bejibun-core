import StrBuilder from "@/builders/StrBuilder";

export default class Str {
    public static toPascalCase(value: string, combine?: boolean): StrBuilder | string {
        return new StrBuilder().setValue(value).toPascalCase(combine);
    }
}