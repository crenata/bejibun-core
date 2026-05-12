import App from "@bejibun/app";
import Database from "@bejibun/database";
import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";
import Kernel from "@/decorators/Kernel";
import "@/globals/index";
import NamespaceLoader from "@/loader/NamespaceLoader";

(BaseModel as any as typeof Model).knex(Database.knex());

Kernel.registerDecorator();

await NamespaceLoader.load(App.Path.jobsPath());
await NamespaceLoader.load(App.Path.modelsPath());