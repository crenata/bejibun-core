import fs from "fs";
import path from "path";
import readline from "readline";
import CorsHeaderEnum from "../enums/CorsHeaderEnum";
import HttpMethodEnum from "../enums/HttpMethodEnum";
import Enum from "../facades/Enum";
export const isEmpty = (value) => {
    return (value === undefined ||
        value === null ||
        value === false ||
        value === 0 ||
        value === 0n ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0));
};
export const isNotEmpty = (value) => {
    return !isEmpty(value);
};
export const defineValue = (value, defaultValue = null) => {
    if (isNotEmpty(value))
        return value;
    return defaultValue;
};
export const ask = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        return rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};
export const cors = () => {
    const configPath = path.resolve(process.cwd(), "config/cors.ts");
    let corsConfig;
    if (fs.existsSync(configPath))
        corsConfig = require(configPath).default;
    else
        corsConfig = require("../config/cors").default;
    const headers = {
        "Access-Control-Allow-Origin": corsConfig.origin,
        "Access-Control-Allow-Headers": Array.isArray(corsConfig.allowedHeaders)
            ? corsConfig.allowedHeaders.join(", ")
            : Enum.setEnums(CorsHeaderEnum).toArray().map((value) => value.value).join(", "),
        "Access-Control-Allow-Methods": Array.isArray(corsConfig.methods)
            ? corsConfig.methods.join(", ")
            : Enum.setEnums(HttpMethodEnum).toArray().map((value) => value.value).join(", ")
    };
    if (corsConfig.exposedHeaders.length > 0)
        headers["Access-Control-Expose-Headers"] = corsConfig.exposedHeaders.join(", ");
    if (corsConfig.credentials)
        headers["Access-Control-Allow-Credentials"] = "true";
    if (corsConfig.maxAge)
        headers["Access-Control-Max-Age"] = corsConfig.maxAge.toString();
    return headers;
};
