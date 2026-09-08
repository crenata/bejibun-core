<div align="center">

<img src="https://github.com/Bejibun-Framework/bejibun/blob/master/public/images/bejibun.png?raw=true" width="150" alt="Bejibun" />

![GitHub top language](https://img.shields.io/github/languages/top/Bejibun-Framework/bejibun-core)
![NPM Downloads](https://img.shields.io/npm/d18m/%40bejibun%2Fcore)
![GitHub issues](https://img.shields.io/github/issues/Bejibun-Framework/bejibun-core)
![GitHub](https://img.shields.io/github/license/Bejibun-Framework/bejibun-core)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Bejibun-Framework/bejibun-core?display_name=tag&include_prereleases)

</div>

# Core of Bejibun
Core of Bejibun Framework.

## Usage

### Installation
Install the package.

```bash
bun add @bejibun/core
```

### Available Commands
To see list of available commands, run.

```bash
bun ace
bun ace help
bun ace --h
bun ace --help
```

To see help of specific command, run :

```bash
bun ace help migrate:latest
bun ace migrate:latest --h
bun ace migrate:latest --help
```

### Database

#### Migrations
To fresh or drop all table and re-run the migrations, run :

```bash
bun ace migrate:fresh
```

Example :

```bash
This will DROP ALL tables and re-run ALL migrations. Are you want to continue? (Y/N): Y

✔ Rolled back all migrations
✔ Batch 1 finished
✔ 20250929_000001_tests.ts
```

To migrate the migrations, run :

```bash
bun ace migrate:latest
```

Example :

```bash
✔ Batch 1 finished
✔ 20250929_000001_tests.ts
```

To rollback the migrations, run :

```bash
bun ace migrate:rollback
```

Example :

```bash
This will ROLLBACK latest migrations. Are you want to continue? (Y/N): Y

✔ Batch 1 finished
✔ 20250929_000001_tests.ts
```

To see migrations status, run :

```bash
bun ace migrate:status
```

Example :

```bash
✔ Completed Migrations :
✔ No migrations were completed.

✔ Pending Migrations :
✔ 20250929_000001_tests.ts
```

#### Seeders
To execute seeder, run :

```bash
bun ace db:seed
```

Example :

```bash
✔ Seeding finished
✔ 20250929_000001_seeder_test.ts
```

### Run the Project
To run the project, run :

```bash
# Development Mode
bun dev

# Production Mode
bun start
```

## Features

### Controllers
Logical processes

Example :

```ts app/controllers/HelloController.ts
import BaseController from "@bejibun/core/bases/BaseController";

export default class HelloController extends BaseController {
    public async hello(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData({
            message: "Hello, world!",
            method: request.method
        }).send();
    }
}
```

### Exception Handler
Handle any incoming errors

Example :

```ts app/exceptions/handler.ts
import ExceptionHandler from "@bejibun/core/exceptions/ExceptionHandler";

export default class Handler extends ExceptionHandler {
    public handle(error: any): Bejibun.Response {
        // Your code goes here
        return super.handle(error);
    }
}
```

### Middlewares
Handle any request before forwarding to controller

Example :

```ts app/middlewares/TestMiddleware.ts
import type {HandlerType} from "@bejibun/core/types";
import Logger from "@bejibun/logger";

export default class TestMiddleware {
    public handle(handler: HandlerType): HandlerType {
        return async (request: Bun.BunRequest) => {
            Logger.setContext("TestMiddleware").debug(request.url);

            return handler(request);
        };
    }
}
```

Usage :

```ts routes/api/test.ts
import Router from "@bejibun/core/facades/Router";
import YourController from "@/app/controllers/YourController";
import TestMiddleware from "@/app/middlewares/TestMiddleware";
import LoggerMiddleware from "@/app/middlewares/LoggerMiddleware";

export default Router.prefix("test")
    .middleware(
        new TestMiddleware(),
        new LoggerMiddleware()
    )
    .group([
        Router.get("/", "TestController@index"),
        Router.get("/:id", "TestController@show"),
        Router.post("/", "TestController@store"),
        Router.put("/:id", "TestController@update"),
        Router.delete("/:id", "TestController@destroy"),
        Router.patch("/:id", "TestController@restore"),

        Router.resource("path", YourController),
        Router.resource("path", YourController, {
            only: ["index", "store"] // "index" | "store" | "show" | "update" | "destroy"
        }),
        Router.resource("path", YourController, {
            except: ["index", "store"] // "index" | "store" | "show" | "update" | "destroy"
        })
    ]);
```

### Validators
Validate any incoming requests

Example :

```ts app/validators/TestValidator.ts
import type {ValidatorType} from "@bejibun/core/types/ValidatorType";
import BaseValidator from "@bejibun/core/bases/BaseValidator";
import TestModel from "@/app/models/TestModel";

export default class TestValidator extends BaseValidator {
    public static get show(): ValidatorType {
        return super.validator.create({
            id: super.validator.number().min(1).exists(TestModel, "id")
        });
    }

    public static get store(): ValidatorType {
        return super.validator.create({
            name: super.validator.string()
        });
    }

    public static get update(): ValidatorType {
        return super.validator.create({
            id: super.validator.number().min(1).exists(TestModel, "id"),
            name: super.validator.string()
        });
    }

    public static get destroy(): ValidatorType {
        return super.validator.create({
            id: super.validator.number().min(1).exists(TestModel, "id")
        });
    }

    public static get restore(): ValidatorType {
        return super.validator.create({
            id: super.validator.number().min(1).exists(TestModel, "id", true)
        });
    }
}
```

Usage :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Show detail test",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                }
            ]
        }
    })
    public async show(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.show, body);

        const test = await TestModel.findOrFail(body.id as number | string);

        return super.response.setData(test).send();
    }
}
```

### Models
Database table model

Example :

```ts app/models/TestModel.ts
import type {Timestamp, NullableTimestamp} from "@bejibun/core/bases/BaseModel";
import BaseModel from "@bejibun/core/bases/BaseModel";

export default class TestModel extends BaseModel {
    public static tableName: string = "tests";
    public static idColumn: string = "id";

    declare id: bigint;
    declare name: string;
    declare created_at: Timestamp;
    declare updated_at: Timestamp;
    declare deleted_at: NullableTimestamp;
}
```

#### Fetch All
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Get test list",
        tags: ["Test"]
    })
    public async index(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.all();

        return super.response.setData(tests).send();
    }
}
```

#### Find or Fail
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Show detail test",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                }
            ]
        }
    })
    public async show(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.show, body);

        const test = await TestModel.findOrFail(body.id as number | string);

        return super.response.setData(test).send();
    }
}
```

#### Create
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Store test data",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "name",
                    in: "query",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ]
        }
    })
    public async store(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.store, body);

        const test = await TestModel.create({
            name: body.name as string
        });

        return super.response.setData(test).send();
    }
}
```

#### Update
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Update test data",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                },
                {
                    name: "name",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ]
        }
    })
    public async update(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.update, body);

        const test = await TestModel.find(body.id as number | string)
            .update({
                name: body.name as string
            });

        return super.response.setData(test).send();
    }
}
```

#### Soft Delete
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Destroy test data",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                }
            ]
        }
    })
    public async destroy(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.destroy, body);

        const test = await TestModel.find(body.id as number | string).delete();

        return super.response.setData(test).send();
    }
}
```

#### Force Delete
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Destroy test data",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                }
            ]
        }
    })
    public async destroy(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.destroy, body);

        const test = await TestModel.find(body.id as number | string).forceDelete();

        return super.response.setData(test).send();
    }
}
```

#### With Trashed
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Get test list",
        tags: ["Test"]
    })
    public async indexWithTrashed(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.withTrashed();

        return super.response.setData(tests).send();
    }
}
```

#### Only Trashed
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Get test list",
        tags: ["Test"]
    })
    public async indexOnlyTrashed(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.onlyTrashed();

        return super.response.setData(tests).send();
    }
}
```

#### Restore
Example :

```ts app/controllers/TestController.ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    @ApiDoc({
        description: "Restore test data",
        tags: ["Test"],
        request: {
            params: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "number"
                    }
                }
            ]
        }
    })
    public async restore(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.restore, body);

        const test = await TestModel.find(body.id as number | string).restore();

        return super.response.setData(test).send();
    }
}
```

### Database

#### Migrations
Example :

```ts database/migrations/20250929_000001_tests.ts
import type {Knex} from "knex";
import TestModel from "@/app/models/TestModel";

export function up(knex: Knex): void {
    return knex.schema.createTable(TestModel.table, (table: Knex.TableBuilder) => {
        table.bigIncrements("id");
        table.string("name");
        table.timestamps(true, true);
        table.timestamp("deleted_at");
    });
}

export function down(knex: Knex): void {
    return knex.schema.dropTable(TestModel.table);
}
```

#### Seeders
Example :

```ts database/seeders/20250929_000001_tests.ts
import type {Knex} from "knex";
import TestModel from "@/app/models/TestModel";

export async function seed(knex: Knex): Promise<void> {
    for (const name of ["Name 1", "Name 2", "Name 3"]) {
        await TestModel.query(knex).insert({
            name: name
        });
    }
}
```

### Bootstrap
Any startup loads

```ts bootstrap.ts
import App from "@bejibun/app";
import Cors from "@bejibun/cors";
import Database from "@bejibun/database";
import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";
import "@/globals/index";
import Kernel from "@/Kernel";
import NamespaceLoader from "@/loader/NamespaceLoader";
import CorsLoader from "@/loader/CorsLoader";

(BaseModel as any as typeof Model).knex(Database.knex());

Kernel.registerDecorator();
Kernel.registerWebSockets();

await NamespaceLoader.load(App.Path.jobsPath());
await NamespaceLoader.load(App.Path.modelsPath());

CorsLoader.set(Cors.init);
```

### Storage
Documentation: [@bejibun/storage](https://github.com/Bejibun-Framework/bejibun-storage/blob/master/README.md)

A filesystem facade, with built-in disk management including disks configuration and build disk at runtime.

- Standard Use
```ts
import Storage from "@bejibun/storage";

await Storage.exists("path/to/your/file.ext"); // Check if the file exists
await Storage.missing("path/to/your/file.ext"); // Check if the file doesn't exists
await Storage.get("path/to/your/file.ext"); // Get data content
await Storage.put("path/to/your/file.ext", "content"); // Store content to file
await Storage.copy("source/file.ext", "destination/file.ext"); // Copy file
await Storage.move("source/file.ext", "destination/file.ext"); // Move file
await Storage.delete("path/to/your/file.ext"); // Delete file
await Storage.metadata("path/to/your/file.ext"); // Retrieve complete file metadata and statistics
await Storage.size("path/to/your/file.ext"); // Get the file size in bytes
await Storage.mimeType("path/to/your/file.ext"); // Get the file MIME type
await Storage.lastModified("path/to/your/file.ext"); // Get the file's last modification date
```

- With Specified Disk
```ts
import Storage from "@bejibun/storage";

await Storage.disk("public").exists("path/to/your/file.ext");
await Storage.disk("public").missing("path/to/your/file.ext");
await Storage.disk("public").get("path/to/your/file.ext");
await Storage.disk("public").put("path/to/your/file.ext", "content");
await Storage.disk("public").copy("source/file.ext", "destination/file.ext");
await Storage.disk("public").move("source/file.ext", "destination/file.ext");
await Storage.disk("public").delete("path/to/your/file.ext");
await Storage.disk("public").metadata("path/to/your/file.ext");
await Storage.disk("public").size("path/to/your/file.ext");
await Storage.disk("public").mimeType("path/to/your/file.ext");
await Storage.disk("public").lastModified("path/to/your/file.ext");
```

- New Disk at Runtime
```ts
import Storage from "@bejibun/storage";

await Storage.build({
    driver: "local", // "local" | StorageDiskDriverEnum.Local
    root: App.Path.storagePath("custom")
}).exists("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).missing("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).get("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).put("path/to/your/file.ext", "content");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).copy("source/file.ext", "destination/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).move("source/file.ext", "destination/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).delete("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).metadata("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).size("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).mimeType("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).lastModified("path/to/your/file.ext");
```

### Rate Limiter
Documentation: [@bejibun/limiter](https://github.com/Bejibun-Framework/bejibun-limiter/blob/master/README.md)

Throttle repeated actions -- login attempts, API calls, anything you need to cap -- with a simple key-based counter.

```ts
import RateLimiter from "@bejibun/limiter";

await RateLimiter.attempt(`user:${user.id}`, 60 /* limit */, () => {
    //
}, 60 /* duration (optional) */);
await RateLimiter.tooManyAttempts(`user:${user.id}`, 60 /* limit */, 60 /* duration (optional) */);
await RateLimiter.clear(`user:${user.id}`);
```

### Queue
Run processes at background.

```ts
// Immediately
await TestJob.dispatch(/*any params here*/).send();

// With delay
await TestJob.dispatch(/*any params here*/).delay(60 * 10 /*10 minutes*/).send();
```

### Decorator
All available decorators.

#### @ApiDoc
```ts
@ApiDoc({
    description: "Hello with Name",
    request: {
        params: [
            {
                name: "name",
                in: "path",
                required: true,
                schema: {
                    type: "string"
                }
            }
        ]
    }
})
public async helloName(request: Bun.BunRequest): Promise<Response> {
    const body = await super.parse(request);
    await super.validate(HelloValidator.helloName, body);

    return super.response.setData({
        message: `Hello, ${body.name}!`,
    }).send();
}
```

### Scheduler
Run code in period.
```ts commands/Kernel.ts
import type Schedule from "@bejibun/core/facades/Schedule";

export default class Kernel {
    public schedule(schedule: Schedule): void {
        // Your code goes here
        schedule.command("hello:world").everyMinute();
    }
}
```

### WebSocket
Setup websocket like router.
```ts routes/websocket/chat.ts
import Router from "@bejibun/core/facades/Router";

export default Router.prefix("chat").group([
    Router.websocket("/", "ChatWebSocket@handle")
]);
```

```ts app/websockets/ChatWebSocket.ts
import BaseWebSocket from "@bejibun/core/bases/BaseWebSocket";

export default class ChatWebSocket extends BaseWebSocket {
    public async handle(ws: Bun.ServerWebSocket<any>, message: string | Buffer<ArrayBuffer>): Promise<void> {
        for (const connection of super.connections) {
            if (connection.data.id !== ws.data.id) {
                if (connection.readyState === 1) {
                    connection.send(message);
                }
            }
        }
    }
}
```

### Global Functions

#### Config
```ts
config("disk.default");
```

#### Env
```ts
env("APP_KEY");
```

### Redis
Documentation: [@bejibun/redis](https://github.com/Bejibun-Framework/bejibun-redis/blob/master/README.md)

```ts
import type {RedisPipeline} from "@bejibun/redis/types";
import BaseController from "@bejibun/core/bases/BaseController";
import Logger from "@bejibun/logger";
import Redis from "@bejibun/redis";

export default class TestController extends BaseController {
    public async redis(request: Bun.BunRequest): Promise<Response> {
        await Redis.set("redis", {hello: "world"});
        
        const keys = await Redis.keys("pattern");
        
        const redis = await Redis.get("redis");

        await Redis.connection("local").set("connection", "This is using custom connection.");
        const connection = await Redis.connection("local").get("connection");

        await Redis.setClient({
            host: "127.0.0.1",
            port: 6379,
            password: "",
            database: 0,
            maxRetries: 10
        }, "optional-connection-name").set("redis", {hello: "world"});
        // for publish and subscibe recommended using custom connection name to make sure connection matched

        const pipeline = await Redis.pipeline((pipe: RedisPipeline) => {
            pipe.set("redis-pipeline-1", "This is redis pipeline 1");
            pipe.set("redis-pipeline-2", "This is redis pipeline 2");

            pipe.get("redis-pipeline-1");
            pipe.get("redis-pipeline-2");
        });

        const subscriber = await Redis.subscribe("redis-subscribe", (message: string, channel: string) => {
            Logger.setContext(channel).debug(message);
        });
        await Redis.publish("redis-subscribe", "Hai redis subscriber!");

        await Bun.sleep(500);

        await subscriber.unsubscribe();

        await Redis.exists("visitors");

        await Redis.incr("visitors");
        await Redis.decr("visitors");

        await Redis.incrBy("visitors", 10);
        await Redis.decrBy("visitors", 5);

        return super.response.setData({redis, connection, pipeline}).send();
    }
}
```

### Cors
Documentation: [@bejibun/cors](https://github.com/Bejibun-Framework/bejibun-cors/blob/master/README.md)

```ts
const config: Record<string, any> = {
    allowedHeaders: "*",
    credentials: false,
    exposedHeaders: [],
    maxAge: 86400,
    methods: "*",
    origin: "*"
};

export default config;
```

### Cache
Documentation: [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache/blob/master/README.md)

```ts
import Cache from "@bejibun/cache";

Cache.connection();
await Cache.remember("key", () => {}, 60 /* seconds */); // any
await Cache.has("key"); // boolean
await Cache.get("key"); // any
await Cache.add("key", "Hello world", 60 /* seconds */); // boolean
await Cache.put("key", "Lorem ipsum", 60 /* seconds */); // boolean
await Cache.forget("key"); // void
await Cache.increment("key"); // number
await Cache.decrement("key"); // number
await Cache.incrementBy("key", 5); // number
await Cache.decrementBy("key", 5); // number
```

### Ace
Any commands for development

```bash
Usage: ace [options] [command]

Ace for your commander
Author: Havea Crenata <havea.crenata@gmail.com>

Options:
  -v, --version                Show the current version
  -h, --help                   display help for command

Commands:
  db:seed [options]            Run database seeders
  hello:world                  Run hello world
  install <packages...>        Install package dependencies
  maintenance:down [options]   Turn app into maintenance mode
  maintenance:up               Turn app into live mode
  make:command <file>          Create a new command file
  make:controller <file>       Create a new controller file
  make:job <file>              Create a new job file
  make:middleware <file>       Create a new middleware file
  make:migration <file>        Create a new migration file
  make:model <file>            Create a new model file
  make:seeder <file>           Create a new seeder file
  make:validator <file>        Create a new validator file
  migrate:fresh [options]      Rollback all migrations and re-run migrations
  migrate:latest               Run latest migration
  migrate:rollback [options]   Rollback the latest migrations
  migrate:status [options]     List migrations status
  package:configure [options]  Configure package after installation
  queue:flush                  Flush all of the failed queue jobs
  queue:retry                  Retry a failed queue job
  queue:work                   Start processing jobs on the queue as a daemon
  route:list                   List all registered routes
  schedule:work                Start the schedule worker
  help [command]               display help for command

Examples:
  $ bun ace --help
  $ bun ace --version
  $ bun ace migrate:latest
```

## ☕ Support / Donate

If you find this project helpful and want to support it:

[![Donate](https://img.shields.io/badge/Donate-Support%20Me-orange?style=for-the-badge)](https://donate.bejibun.com)

Or you can buy this `$BJBN (Bejibun)` tokens [here](https://pump.fun/coin/CQhbNnCGKfDaKXt8uE61i5DrBYJV7NPsCDD9vQgypump).