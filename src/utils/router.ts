import {defineValue, isEmpty} from "@bejibun/utils";

export const vineToSwaggerParams = (vineSchema: any, location: string = "query"): Array<Record<string, any>> => {
    if (isEmpty(vineSchema)) return [];

    const params: Array<Record<string, any>> = [];
    const fields = vineSchema.schema.getProperties();

    for (const [key, field] of Object.entries(fields)) {
        const schema: Record<string, any> = {};
        const rules: Array<any> = defineValue((field as any).rules, []);

        switch ((field as any).type) {
            case "string":
                schema.type = "string";
                break;
            case "number":
                schema.type = "number";
                break;
            case "boolean":
                schema.type = "boolean";
                break;
            default:
                schema.type = "string";
        }

        let required: boolean = true;

        for (const rule of rules) {
            switch (rule.name) {
                case "email":
                    schema.format = "email";
                    break;
                case "minLength":
                    schema.minLength = rule.args[0];
                    break;
                case "maxLength":
                    schema.maxLength = rule.args[0];
                    break;
                case "regex":
                    schema.pattern = rule.args[0].source;
                    break;
                case "enum":
                    schema.enum = rule.args[0];
                    break;
                case "optional":
                    required = false;
                    break;
                case "nullable":
                    schema.nullable = true;
                    break;
                case "confirmed":
                    params.push({
                        name: `${key}_confirmation`,
                        in: location,
                        required: true,
                        schema: {
                            type: "string"
                        }
                    });
                    break;
            }
        }

        params.push({
            name: key,
            in: location, // "path" | "query" | "header"
            required,
            schema
        });
    }

    return params;
};