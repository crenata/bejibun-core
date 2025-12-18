<div align="center">

<img src="https://github.com/crenata/bejibun/blob/master/public/images/bejibun.png?raw=true" width="150" alt="Bejibun" />

![GitHub top language](https://img.shields.io/github/languages/top/crenata/bejibun-core)
![GitHub all releases](https://img.shields.io/github/downloads/crenata/bejibun-core/total)
![GitHub issues](https://img.shields.io/github/issues/crenata/bejibun-core)
![GitHub](https://img.shields.io/github/license/crenata/bejibun-core)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/crenata/bejibun-core?display_name=tag&include_prereleases)

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

## Features

### Controllers
Logical processes

Example :

```ts
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

```ts
import ExceptionHandler from "@bejibun/core/exceptions/ExceptionHandler";

export default class Handler extends ExceptionHandler {
    public handle(error: any): globalThis.Response {
        // Your code goes here
        return super.handle(error);
    }
}
```

### Middlewares
Handle any request before forwarding to controller

Example :

```ts
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

```ts
import Router from "@bejibun/core/facades/Router";
import TestMiddleware from "@/app/middlewares/TestMiddleware";
import LoggerMiddleware from "@/app/middlewares/LoggerMiddleware";

export default Router.prefix("test")
    .middleware(
        new TestMiddleware(),
        new LoggerMiddleware()
    )
    .group([
        Router.get("redis", "TestController@redis"),
        Router.get("get", "TestController@get"),
        Router.get("detail/:id", "TestController@detail"),
        Router.post("add", "TestController@add"),
        Router.post("edit", "TestController@edit"),
        Router.delete("delete/:id", "TestController@delete"),
        Router.get("restore/:id", "TestController@restore")
    ]);
```

### Validators
Validate any incoming requests

Example :

```ts
import type {ValidatorType} from "@bejibun/core/types/ValidatorType";
import BaseValidator from "@bejibun/core/bases/BaseValidator";
import TestModel from "@/app/models/TestModel";

export default class TestValidator extends BaseValidator {
    public static get detail(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TestModel, "id")
            })
        );
    }

    public static get add(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                name: super.validator.string()
            })
        );
    }

    public static get edit(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TestModel, "id"),
                name: super.validator.string()
            })
        );
    }

    public static get delete(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TestModel, "id")
            })
        );
    }

    public static get restore(): ValidatorType {
        return super.validator.compile(
            super.validator.object({
                id: super.validator.number().min(1).exists(TestModel, "id", true)
            })
        );
    }
}
```

Usage :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async detail(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.detail, body);

        const test = await TestModel.findOrFail(body.id as number | string);

        return super.response.setData(test).send();
    }
}
```

### Models
Database table model

Example :

```ts
import BaseModel, {BaseColumns} from "@bejibun/core/bases/BaseModel";
import {DateTime} from "luxon";

export interface TestColumns extends BaseColumns {
    name: string;
}

export default class TestModel extends BaseModel implements TestColumns {
    public static tableName: string = "tests";
    public static idColumn: string = "id";

    declare id: bigint;
    declare name: string;
    declare created_at: DateTime | string;
    declare updated_at: DateTime | string;
    declare deleted_at: DateTime | string | null;
}
```

#### Fetch All
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    public async get(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.all();

        return super.response.setData(tests).send();
    }
}
```

#### Find or Fail
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async detail(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.detail, body);

        const test = await TestModel.findOrFail(body.id as number | string);

        return super.response.setData(test).send();
    }
}
```

#### Create
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async add(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.add, body);

        const tests = await TestModel.create({
            name: body.name as string
        });

        return super.response.setData(tests).send();
    }
}
```

#### Update
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async edit(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.edit, body);

        const tests = await TestModel.find(body.id as number | string)
            .update({
                name: body.name as string
            });

        return super.response.setData(tests).send();
    }
}
```

#### Soft Delete
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async delete(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.delete, body);

        const tests = await TestModel.find(body.id as number | string).delete();

        return super.response.setData(tests).send();
    }
}
```

#### Force Delete
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";
import TestValidator from "@/app/validators/TestValidator";

export default class TestController extends BaseController {
    public async delete(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.delete, body);

        const tests = await TestModel.find(body.id as number | string).forceDelete();

        return super.response.setData(tests).send();
    }
}
```

#### With Trashed
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    public async get(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.withTrashed();

        return super.response.setData(tests).send();
    }
}
```

#### Only Trashed
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    public async get(request: Bun.BunRequest): Promise<Response> {
        const tests = await TestModel.onlyTrashed();

        return super.response.setData(tests).send();
    }
}
```

#### Restore
Example :

```ts
import BaseController from "@bejibun/core/bases/BaseController";
import TestModel from "@/app/models/TestModel";

export default class TestController extends BaseController {
    public async restore(request: Bun.BunRequest): Promise<Response> {
        const body = await super.parse(request);
        await super.validate(TestValidator.restore, body);

        const tests = await TestModel.find(body.id as number | string).restore();

        return super.response.setData(tests).send();
    }
}
```

### Database

#### Migrations
Example :

```ts
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

```ts
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

```ts
import Database from "@bejibun/database";
import {Model} from "objection";
import BaseModel from "@/bases/BaseModel";

(BaseModel as any as typeof Model).knex(Database.knex());
```

### Storage
A facade for filesystem.

```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.get("path/to/your/file.ext");
await Storage.put("path/to/your/file.ext", "content");

/* Process file with specified disk */
await Storage.disk("public").get("path/to/your/file.ext");
await Storage.disk("public").put("path/to/your/file.ext", "content");

/* Create a new disk at runtime */
await Storage.build({
    driver: "local", // "local", DiskDriverEnum.Local
    root: App.Path.storagePath("custom")
}).get("path/to/your/file.ext");
await Storage.build({
    driver: "local", // "local", DiskDriverEnum.Local
    root: App.Path.storagePath("custom")
}).put("path/to/your/file.ext", "content");
```

### Cors
Documentation : [@bejibun/cors](https://github.com/crenata/bejibun-cors/blob/master/README.md)

### Cache
Documentation : [@bejibun/cache](https://github.com/crenata/bejibun-cache/blob/master/README.md)

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
  db:seed                      Run database seeders
  hello:world                  Run hello world
  install <packages...>        Install package dependencies
  maintenance:down [options]   Turn app into maintenance mode
  maintenance:up               Turn app into live mode
  make:command <file>          Create a new command file
  make:controller <file>       Create a new controller file
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
  help [command]               display help for command

Examples:
  $ bun ace --help
  $ bun ace --version
  $ bun ace migrate:latest
```

## Contributors
- [Havea Crenata](mailto:havea.crenata@gmail.com)

## ☕ Support / Donate

If you find this project helpful and want to support it, you can donate via crypto :

| EVM                                                                                                     | Solana                                                                                                  |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/crenata/bejibun/blob/master/public/images/EVM.png?raw=true" width="150" /> | <img src="https://github.com/crenata/bejibun/blob/master/public/images/SOL.png?raw=true" width="150" /> |
| 0xdABe8750061410D35cE52EB2a418c8cB004788B3                                                              | GAnoyvy9p3QFyxikWDh9hA3fmSk2uiPLNWyQ579cckMn                                                            |

Or you can buy this `$BJBN (Bejibun)` tokens [here](https://pump.fun/coin/CQhbNnCGKfDaKXt8uE61i5DrBYJV7NPsCDD9vQgypump), beware of bots.