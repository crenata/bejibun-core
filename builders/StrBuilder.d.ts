export default class StrBuilder {
    protected value: string;
    constructor();
    setValue(value: string): StrBuilder;
    toPascalCase(combine?: boolean): StrBuilder | string;
}
