import {defineValue, isNotEmpty} from "@/utils/utils";

export default class StrBuilder {
    protected value: string;

    public constructor() {
        this.value = "";
    }

    public setValue(value: string): StrBuilder {
        this.value = value;

        return this;
    }

    public toPascalCase(combine?: boolean): StrBuilder | string {
        this.value = defineValue(this.value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g), [])
            .map((x: string) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join("");

        if (isNotEmpty(combine)) return this;

        return this.value;
    }
}