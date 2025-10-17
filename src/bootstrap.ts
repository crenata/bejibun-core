import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";
import {initDatabase} from "@/config/database";

(BaseModel as any as typeof Model).knex(initDatabase());