import {isEmpty} from "@/utils/utils";

export default class EnumBuilder {
    protected enums: any;

    public constructor(enums: any) {
        if (isEmpty(enums)) throw new Error("The enum parameter is required.");
        this.enums = enums;
    }

    public getName(value: number): string | undefined {
        return Object.keys(this.enums).find(item => this.enums[item] === value);
    }

    public getValue(key: string): number {
        return this.enums[key];
    }

    public toArray(): Array<any> {
        return Object.keys(this.enums)
            .filter(key => isNaN(Number(key)))
            .map(key => ({
                name: key,
                value: this.getValue(key)
            }));
    }
}