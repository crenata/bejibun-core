import type {Knex} from "knex";
import fs from "fs";
import knex from "knex";
import path from "path";

const config: Knex.Config = {
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

export const initDatabase = (): Knex => {
    const configPath = path.resolve(process.cwd(), "config/database.ts");

    let _config: any;

    if (fs.existsSync(configPath)) _config = require(configPath).default;
    else _config = config;

    return knex(_config);
};

export default config;