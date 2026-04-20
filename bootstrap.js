import App from "@bejibun/app";
import Database from "@bejibun/database";
import BaseModel from "./bases/BaseModel";
import Kernel from "./decorators/Kernel";
import NamespaceLoader from "./loader/NamespaceLoader";
BaseModel.knex(Database.knex());
Kernel.registerDecorator();
await NamespaceLoader.load(App.Path.jobsPath());
await NamespaceLoader.load(App.Path.modelsPath());
