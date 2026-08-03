import App from "@bejibun/app";
import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import fs from "fs";
import RuntimeException from "../exceptions/RuntimeException";
globalThis.config = (key, defaultValue = null) => {
    const keys = key.split(".");
    if (isEmpty(keys))
        throw new RuntimeException("Invalid key config.");
    const filename = keys.shift();
    const configPath = App.Path.configPath(`${filename}.ts`);
    if (!fs.existsSync(configPath))
        throw new RuntimeException("Invalid config path.");
    const config = require(configPath).default;
    let value = config;
    for (const segment of keys) {
        if (isNotEmpty(value) &&
            typeof value === "object" &&
            segment in value) {
            value = value[segment];
        }
        else {
            return defaultValue;
        }
    }
    return value;
};
globalThis.env = (key, defaultValue = null) => defineValue(Bun.env[key], defaultValue);
