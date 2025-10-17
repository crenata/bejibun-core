import BaseModel from "@/bases/BaseModel";
import {initDatabase} from "@/config/database";

BaseModel.knex(initDatabase());