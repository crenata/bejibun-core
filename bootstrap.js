import Database from "@bejibun/database";
import BaseModel from "./bases/BaseModel";
BaseModel.knex(Database.knex());
