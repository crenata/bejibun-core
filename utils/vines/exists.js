import vine, { VineNumber, VineString } from "@vinejs/vine";
import BaseModel from "../../bases/BaseModel";
import { defineValue, isEmpty } from "../../utils/utils";
const exists = async (value, options, field) => {
    if (!field.isValid)
        return;
    const column = defineValue(options.column, field.name);
    let query = options.table;
    if (options.withTrashed)
        query = query.withTrashed();
    else
        query = query.query();
    const row = await query.where(column, value).first();
    if (isEmpty(row))
        field.report("The {{ field }} field doesn't exists", "exists", field);
};
const existsRule = vine.createRule(exists, { isAsync: true });
const registerExistsMacro = (Type) => {
    Type.macro("exists", function (tableOrOptions, column, withTrashed) {
        const isModel = typeof tableOrOptions === "function" && Object.prototype.isPrototypeOf.call(BaseModel, tableOrOptions);
        const options = isModel
            ? { table: tableOrOptions, column, withTrashed }
            : tableOrOptions;
        return this.use(existsRule(options));
    });
};
registerExistsMacro(VineString);
registerExistsMacro(VineNumber);
