import BaseValidator from "@bejibun/core/bases/BaseValidator";
import TemplateModel from "@/app/models/TemplateModel";

/**
 * Example validator stub defining the request validation schemas for the
 * template resource's five actions.
 */
export default class TemplateValidator extends BaseValidator {
    /**
     * Validator for the `index` action: an optional `search` string filter.
     */
    public static get index(): Bejibun.Validator {
        return super.validator.compile(
            super.validator.object({
                search: super.validator.string().nullable().optional()
            })
        );
    }

    /**
     * Validator for the `store` action: a required `name` string.
     */
    public static get store(): Bejibun.Validator {
        return super.validator.compile(
            super.validator.object({
                name: super.validator.string()
            })
        );
    }

    /**
     * Validator for the `show` action: a required `id` that must exist on
     * the `TemplateModel` table.
     */
    public static get show(): Bejibun.Validator {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id")
            })
        );
    }

    /**
     * Validator for the `update` action: a required existing `id` and a
     * required `name` string.
     */
    public static get update(): Bejibun.Validator {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id"),
                name: super.validator.string()
            })
        );
    }

    /**
     * Validator for the `destroy` action: a required `id` that must exist
     * on the `TemplateModel` table.
     */
    public static get destroy(): Bejibun.Validator {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id")
            })
        );
    }
}
