import { defineValue, isNotEmpty } from "@bejibun/utils";
import vine, { VineNumber, VineString } from "@vinejs/vine";
import BaseModel from "../../bases/BaseModel";
const unique = async (value, options, field) => {
    if (!field.isValid)
        return;
    const column = defineValue(options.column, field.name);
    let query = options.table;
    if (options.withTrashed)
        query = query.withTrashed();
    else
        query = query.query();
    const row = await query.where(column, value).first();
    if (isNotEmpty(row))
        field.report("The {{ field }} field is already exists", "unique", field);
};
const uniqueRule = vine.createRule(unique, { isAsync: true });
const registerUniqueMacro = (Type) => {
    Type.macro("unique", function (tableOrOptions, column, withTrashed) {
        const isModel = typeof tableOrOptions === "function" && Object.prototype.isPrototypeOf.call(BaseModel, tableOrOptions);
        const options = isModel
            ? { table: tableOrOptions, column, withTrashed }
            : tableOrOptions;
        return this.use(uniqueRule(options));
    });
};
registerUniqueMacro(VineString);
registerUniqueMacro(VineNumber);
