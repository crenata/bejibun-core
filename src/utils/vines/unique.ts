import vine, {VineNumber, VineString} from "@vinejs/vine";
import {QueryBuilderType} from "objection";
import BaseModel from "@/bases/BaseModel";
import {defineValue, isNotEmpty} from "@/utils/utils";

type Options = {
    table: typeof BaseModel;
    column?: string;
    withTrashed?: boolean;
};

const unique = async (value: unknown, options: Options, field: any): Promise<void> => {
    if (!field.isValid) return;

    const column = defineValue(options.column, field.name);

    let query: any = options.table;
    if (options.withTrashed) query = query.withTrashed();
    else query = query.query();

    const row = await (query as QueryBuilderType<any>).where(column, value).first();

    if (isNotEmpty(row)) field.report("The {{ field }} field is already exists", "unique", field);
}

const uniqueRule = vine.createRule(unique, {isAsync: true});

const registerUniqueMacro = (Type: any): void => {
    Type.macro("unique", (tableOrOptions: typeof BaseModel | Options, column?: string, withTrashed?: boolean) => {
        const isModel = typeof tableOrOptions === "function" && Object.prototype.isPrototypeOf.call(BaseModel, tableOrOptions);

        const options: Options = isModel
            ? {table: tableOrOptions as typeof BaseModel, column, withTrashed}
            : tableOrOptions as Options;

        return (this as any).use(uniqueRule(options));
    });
};

registerUniqueMacro(VineString);
registerUniqueMacro(VineNumber);