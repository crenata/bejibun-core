export type EnumItem = {
    name: string;
    value: number;
};
export default class EnumBuilder {
    protected enums: any;
    constructor(enums: any);
    getName(value: number): string | undefined;
    getValue(key: string): number;
    toArray(): Array<any>;
}
