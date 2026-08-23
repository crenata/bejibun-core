import App from "@bejibun/app";
import Cors from "@bejibun/cors";
import Database from "@bejibun/database";
import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";
import "@/globals/index";
import Kernel from "@/Kernel";
import NamespaceLoader from "@/loader/NamespaceLoader";
import CorsLoader from "@/loader/CorsLoader";

/**
 * Application bootstrap script, imported once by both `server.ts` and
 * `ace.ts` before anything else runs. Wires up the pieces every entry
 * point needs regardless of whether the process is serving HTTP traffic
 * or running a CLI command:
 *
 * - Binds the shared Objection.js `Model` (via `BaseModel`) to the
 *   database's Knex connection.
 * - Registers custom decorators (`Kernel.registerDecorator`) and
 *   WebSocket handlers (`Kernel.registerWebSockets`).
 * - Autoloads every job and model class under the application's
 *   `jobs`/`models` directories via `NamespaceLoader`, so they're
 *   available without explicit imports.
 * - Initializes the CORS configuration used by the HTTP server.
 */

// Bind the shared Objection.js Model class to the app's Knex connection.
(BaseModel as any as typeof Model).knex(Database.knex());

Kernel.registerDecorator();
Kernel.registerWebSockets();

// Autoload every job and model class so they're globally available.
await NamespaceLoader.load(App.Path.jobsPath());
await NamespaceLoader.load(App.Path.modelsPath());

CorsLoader.set(Cors.init);
