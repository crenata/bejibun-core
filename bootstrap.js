import App from "@bejibun/app";
import Database from "@bejibun/database";
import BaseModel from "./bases/BaseModel";
import ApiDocDecorator from "./decorators/ApiDocDecorator";
import NamespaceLoader from "./loader/NamespaceLoader";
BaseModel.knex(Database.knex());
await NamespaceLoader.load(App.Path.jobsPath());
await NamespaceLoader.load(App.Path.modelsPath());
globalThis.ApiDoc = ApiDocDecorator;
