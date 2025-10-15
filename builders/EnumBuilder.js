import { isEmpty } from "../utils/utils";
export default class EnumBuilder {
    enums;
    constructor(enums) {
        if (isEmpty(enums))
            throw new Error("The enum parameter is required.");
        this.enums = enums;
    }
    getName(value) {
        return Object.keys(this.enums).find(item => this.enums[item] === value);
    }
    getValue(key) {
        return this.enums[key];
    }
    toArray() {
        return Object.keys(this.enums)
            .filter(key => isNaN(Number(key)))
            .map(key => ({
            name: key,
            value: this.getValue(key)
        }));
    }
}
