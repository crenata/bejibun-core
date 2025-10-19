import App from "@bejibun/app";
import fs from "fs";
import knex from "knex";
const config = {
    client: "pg",
    connection: {
        host: "127.0.0.1",
        port: 5432,
        user: "postgres",
        password: "",
        database: "bejibun"
    },
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
        tableName: "migrations"
    },
    pool: {
        min: 0,
        max: 1
    },
    seeds: {
        extension: "ts",
        directory: "./database/seeders"
    }
};
export const initDatabase = () => {
    const configPath = App.configPath("database.ts");
    let _config;
    if (fs.existsSync(configPath))
        _config = require(configPath).default;
    else
        _config = config;
    return knex(_config);
};
export default config;
