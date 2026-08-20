import App from "@bejibun/app";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import fs from "fs";
import RuntimeException from "@/exceptions/RuntimeException";

(globalThis as any).config = (key: string, defaultValue: any = null): any => {
    const keys: Array<string> = key.split(".");
    if (isEmpty(keys)) throw new RuntimeException("Invalid key config.");

    const filename: string | undefined = keys.shift();
    const configPath: string = App.Path.configPath(`${filename as string}.ts`);
    if (!fs.existsSync(configPath)) throw new RuntimeException("Invalid config path.");

    const config: Record<string, any> = require(configPath).default;

    let value: any = config;

    for (const segment of keys) {
        if (isNotEmpty(value) && typeof value === "object" && segment in value) {
            value = value[segment];
        } else {
            return defaultValue;
        }
    }

    return value;
};
(globalThis as any).env = (key: string, defaultValue: any = null): string | undefined =>
    defineValue(Bun.env[key], defaultValue);
