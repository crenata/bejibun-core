import type {ValidatorType} from "@bejibun/core/types/ValidatorType";
import BaseValidator from "@bejibun/core/bases/BaseValidator";
import TemplateModel from "@/app/models/TemplateModel";

export default class TemplateValidator extends BaseValidator {
    public static get index(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                search: super.validator.string().nullable().optional()
            })
        );
    }

    public static get store(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                name: super.validator.string()
            })
        );
    }

    public static get show(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id")
            })
        );
    }

    public static get update(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id"),
                name: super.validator.string()
            })
        );
    }

    public static get destroy(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TemplateModel, "id")
            })
        );
    }
}