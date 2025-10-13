import {SchemaTypes, VineValidator} from "@vinejs/vine";

export type ValidatorType<T extends SchemaTypes = SchemaTypes> = VineValidator<SchemaTypes, Record<string, any> | undefined>;