import BaseModel from "./bases/BaseModel";
import fs from "fs";
import knex from "knex";
import path from "path";
const configPath = path.resolve(process.cwd(), "config/database.ts");
let config;
if (fs.existsSync(configPath))
    config = require(configPath).default;
else
    config = require("./config/database").default;
BaseModel.knex(knex(config));
