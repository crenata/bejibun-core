import Database from "@bejibun/database";
import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";

(BaseModel as any as typeof Model).knex(Database.knex());