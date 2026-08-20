import {SchemaTypes, VineValidator} from "@vinejs/vine";

export type ValidatorType = VineValidator<SchemaTypes, Record<string, any> | undefined>;
