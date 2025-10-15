import StrBuilder from "../builders/StrBuilder";
export default class Str {
    static toPascalCase(value, combine) {
        return new StrBuilder().setValue(value).toPascalCase(combine);
    }
}
