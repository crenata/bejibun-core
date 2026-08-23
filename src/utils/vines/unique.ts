import type {ExtendOptions} from "@/types/vine";
import {defineValue, isNotEmpty} from "@bejibun/utils";
import vine, {VineNumber, VineString} from "@vinejs/vine";
import {QueryBuilderType} from "objection";
import BaseModel from "@/bases/BaseModel";

/**
 * Async Vine rule implementation backing `.unique()`: fails validation if
 * a matching row already exists in the configured table/column.
 *
 * @param value - The field value being validated.
 * @param options - The resolved `unique` options (table, column, withTrashed, nullable).
 * @param field - Vine's field context, used to report validation errors.
 */
const unique = async (value: unknown, options: ExtendOptions, field: any): Promise<void> => {
    if (!field.isValid) return;
    if (options.nullable) return;

    const column = defineValue(options.column, field.name);

    let query: any = options.table;
    if (options.withTrashed) query = query.withTrashed();
    else query = query.query();

    const row = await (query as QueryBuilderType<any>).where(column, value).first();

    if (isNotEmpty(row)) field.report("The {{ field }} field is already exists", "unique", field);
};

/** The compiled Vine rule wrapping `unique()`, marked async. */
const uniqueRule = vine.createRule(unique, {isAsync: true});

/**
 * Registers a `.unique(tableOrOptions, column?, withTrashed?, nullable?)`
 * macro on the given Vine schema type (`VineString`/`VineNumber`),
 * normalizing either call signature (a model class + separate args, or a
 * single `ExtendOptions` object) into the `ExtendOptions` shape the rule expects.
 *
 * @param Type - The Vine schema type class to attach the macro to.
 */
const registerUniqueMacro = (Type: any): void => {
    Type.macro(
        "unique",
        function (
            this: typeof Type,
            tableOrOptions: typeof BaseModel | ExtendOptions,
            column?: string,
            withTrashed?: boolean,
            nullable?: boolean
        ) {
            const isModel =
                typeof tableOrOptions === "function" &&
                Object.prototype.isPrototypeOf.call(BaseModel, tableOrOptions);

            const options: ExtendOptions = isModel
                ? {
                      table: tableOrOptions as typeof BaseModel,
                      column,
                      withTrashed,
                      nullable
                  }
                : (tableOrOptions as ExtendOptions);

            return this.use(uniqueRule(options));
        }
    );
};

registerUniqueMacro(VineString);
registerUniqueMacro(VineNumber);
