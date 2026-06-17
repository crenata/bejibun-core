# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.4.25](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.24...v0.4.25) - 2026-06-17

### 🩹 Fixes

### 📖 Changes
#### Global Utilities
- Added default value for `env(key: string, defaultValue: any = null)` - Return default value when given key is empty

#### Storage Management Utilities
This release introduces built-in helpers for retrieving file metadata and storage information across supported Storage drivers.

#### Storage Utilities
Added new storage helper methods:
- Added `.metadata()` - Retrieve complete file metadata and statistics
- Added `.size()` - Get the file size in bytes
- Added `.mimeType()` - Get the file MIME type
- Added `.lastModified()` - Get the file's last modification date

**Example:**
```ts
const metadata = await Storage.metadata("uploads/avatar.png");

const size = await Storage.size("uploads/avatar.png");

const mimeType = await Storage.mimeType("uploads/avatar.png");

const lastModified = await Storage.lastModified("uploads/avatar.png");
```

#### Method Signatures
```ts
export interface StorageDriver {
    // ...
    
    /**
     * Retrieve metadata for a file.
     *
     * @param filepath The path to the file.
     * @returns File metadata and statistics.
     */
    metadata(filepath: string): Promise<Stats | Bun.S3Stats>;

    /**
     * Get the file size in bytes.
     *
     * @param filepath The path to the file.
     * @returns The file size in bytes.
     */
    size(filepath: string): Promise<number>;

    /**
     * Get the file MIME type.
     *
     * @param filepath The path to the file.
     * @returns The detected MIME type.
     */
    mimeType(filepath: string): Promise<string>;

    /**
     * Get the file's last modification date.
     *
     * @param filepath The path to the file.
     * @returns The last modified timestamp.
     */
    lastModified(filepath: string): Promise<Date>;
}
```

These helpers provide a simple and consistent API for inspecting files and retrieving metadata without requiring direct access to the underlying storage provider implementation.

### 📦 Dependencies

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.24](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.23...v0.4.24) - 2026-06-02

### 🩹 Fixes

### ⚡ Improvements
#### CORS Initialization Optimization
CORS configuration is now loaded during application startup instead of being resolved per request.

#### Benefits :
- Reduced request-processing overhead
- Faster response times
- Improved throughput under high traffic
- More efficient request lifecycle

#### Comparison :
Before
```shell
# oha -z 10s http://localhost:3000/api/hello
Summary:
  Success rate: 100.00%
  Total:        10001.5150 ms
  Slowest:      53.5521 ms
  Fastest:      0.0475 ms
  Average:      1.3931 ms
  Requests/sec: 35835.2710

  Total data:   28.71 MiB
  Size/request: 84 B
  Size/sec:     2.87 MiB

Response time histogram:
   0.047 ms [1]      |
   5.398 ms [341771] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  10.748 ms [14656]  |■
  16.099 ms [1657]   |
  21.449 ms [153]    |
  26.800 ms [53]     |
  32.150 ms [14]     |
  37.501 ms [36]     |
  42.851 ms [0]      |
  48.202 ms [0]      |
  53.552 ms [50]     |

Response time distribution:
  10.00% in 0.7232 ms
  25.00% in 0.8081 ms
  50.00% in 0.9186 ms
  75.00% in 1.0798 ms
  90.00% in 1.8092 ms
  95.00% in 5.0601 ms
  99.00% in 9.0271 ms
  99.90% in 15.5873 ms
  99.99% in 52.9444 ms


Details (average, fastest, slowest):
  DNS+dialup:   0.4550 ms, 0.1211 ms, 0.9573 ms
  DNS-lookup:   0.0139 ms, 0.0009 ms, 0.1125 ms

Status code distribution:
  [200] 358391 responses

Error distribution:
  [16] aborted due to deadline
```

After
```shell
# oha -z 10s http://localhost:3000/api/hello
Summary:
  Success rate: 100.00%
  Total:        10001.6281 ms
  Slowest:      25.3454 ms
  Fastest:      0.0377 ms
  Average:      0.6426 ms
  Requests/sec: 77538.4760

  Total data:   62.12 MiB
  Size/request: 84 B
  Size/sec:     6.21 MiB

Response time histogram:
   0.038 ms [1]      |
   2.568 ms [759352] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
   5.099 ms [15467]  |
   7.630 ms [380]    |
  10.161 ms [17]     |
  12.692 ms [86]     |
  15.222 ms [49]     |
  17.753 ms [50]     |
  20.284 ms [0]      |
  22.815 ms [49]     |
  25.345 ms [51]     |

Response time distribution:
  10.00% in 0.4064 ms
  25.00% in 0.4520 ms
  50.00% in 0.5122 ms
  75.00% in 0.6009 ms
  90.00% in 0.9154 ms
  95.00% in 1.2295 ms
  99.00% in 3.0504 ms
  99.90% in 4.7744 ms
  99.99% in 22.5150 ms


Details (average, fastest, slowest):
  DNS+dialup:   1.7204 ms, 1.2155 ms, 2.2845 ms
  DNS-lookup:   0.0165 ms, 0.0008 ms, 0.1865 ms

Status code distribution:
  [200] 775502 responses

Error distribution:
  [9] aborted due to deadline
```

### 📦 Dependencies

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.23](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.22...v0.4.23) - 2026-06-02

### 🩹 Fixes

### 📖 Changes
#### Counter & Numeric Value Utilities
This release introduces built-in helpers for managing counters and numeric values across Redis and Cache drivers.

#### Redis Utilities
Added new Redis helper methods :
- Added `.exists()` Check whether a key exists
- Added `.incr()` Increment a numeric value by 1
- Added `.decr()` Decrement a numeric value by 1
- Added `.incrBy()` Increment a numeric value by a specified amount
- Added `.decrBy()` Decrement a numeric value by a specified amount

#### Example :
```ts
await Redis.exists("visitors");

await Redis.incr("visitors");
await Redis.decr("visitors");

await Redis.incrBy("visitors", 10);
await Redis.decrBy("visitors", 5);
```

#### Cache Utilities
Added atomic cache counter operations :
- Added `.incrementBy()` Increment a numeric value by a specified amount
- Added `.decrementBy()` Decrement a numeric value by a specified amount

#### Example :
```ts
await Cache.incrementBy("cache-key", 10);
await Cache.decrementBy("cache-key", 5);
```

These helpers eliminate the need for manual read-modify-write operations and provide a cleaner API for working with numeric values.

### 📦 Dependencies
- Upgraded `@bejibun/redis` to v0.1.45
- Upgraded `@bejibun/cache` to v0.1.23

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.22](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.2...v0.4.22) - 2026-06-01

### 🩹 Fixes
- Invalid parameter for specific seeder - [#2](https://github.com/Bejibun-Framework/bejibun-database/issues/2)

### 📖 Changes
#### WebSocket Controller Enhancements
To simplify connection management and enable more advanced real-time features, the current WebSocket client instance is now automatically passed to controller methods.

#### New controller signature :
```ts
(ws: Bun.ServerWebSocket<any>, message: string | Buffer<ArrayBuffer>)
```

#### This allows handlers to :
- Access the active client connection directly
- Identify the sender without performing additional lookups
- Broadcast messages more efficiently
- Build room, presence, and private messaging systems with less boilerplate

#### Updated websocket routing example :
```ts
import Router from "@bejibun/core/facades/Router";

export default Router.prefix("chat").group([
    Router.websocket("/", "ChatWebSocket@handle")
]);
```

```ts
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

### 📦 Dependencies
- Upgraded `@bejibun/database` to v0.1.21

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.2](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.1...v0.4.2) - 2026-05-31

### 🩹 Fixes

### 📖 Changes
- Added `.testsPath(path?: string)` path to `tests` directory
- Added `.websocketsPath(path?: string)` path to `app/websockets` directory

#### Upgrade [@bejibun/app](https://github.com/Bejibun-Framework/bejibun-app) to v0.1.24
[https://github.com/Bejibun-Framework/bejibun-app/releases/tag/v0.1.24](https://github.com/Bejibun-Framework/bejibun-app/releases/tag/v0.1.24)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.1](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.4.0...v0.4.1) - 2026-05-28

### 🩹 Fixes
- Fix crashed `bun ace`

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.4.0](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.16...v0.4.0) - 2026-05-28

### 🩹 Fixes

### 📖 Changes
- Introduced WebSocket route support with a simple router-based setup
- Added `Router.websocket()` method for registering WebSocket handlers directly from the router
- Enabled prefix chaining support for WebSocket routes using `Router.prefix()`
- Simplified WebSocket initialization to match standard HTTP route definitions for a more consistent developer experience

### Feedback
- WebSocket routes now feel identical to regular route registration
- Reduced boilerplate for real-time feature setup
- Cleaner and more maintainable routing configuration

Example
```ts
import Router from "@bejibun/core/facades/Router";

export default Router.prefix("hello").group([
    Router.websocket("websocket", "HelloWebSocket@handle")
]);
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.16](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.15...v0.3.16) - 2026-05-25

### 🩹 Fixes

### 📖 Changes
- Swagger improvements - [#23](https://github.com/Bejibun-Framework/bejibun-core/pull/23)
- Adds a sleep to `queue:work` if the job is empty to prevent access to the database

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.15](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.14...v0.3.15) - 2026-05-21

### 🩹 Fixes
- Reworked schedule worker execution logic to fix cron timing inaccuracies
- Fixed potential duplicate execution caused by cron re-evaluation per tick
- Fixed drift issues in scheduling caused by `cron-parser.prev()` based checks
- Fixed possible stuck running state by ensuring cleanup in finally
- Improved shutdown handling of schedule worker interval

### 📖 Changes
- Replaced per-tick cron parsing with cached `CronExpression`
- Added `nextRun` based execution system instead of `lastRuns` tracking
- Replaced `setInterval` loop with adaptive `setTimeout` scheduler (better timing accuracy)
- Added `prepareSchedules()` step during boot to register all cron jobs once
- Improved `run()` execution to await process completion (`proc.exited`)
- Reduced runtime overhead in scheduler tick loop
- Reduced CPU usage by eliminating repeated cron parsing every second
- More efficient scheduler loop using timestamp comparisons instead of cron evaluation
- Better scaling behavior when many scheduled tasks exist
- Removed internal reliance on lastRuns tracking system
- Scheduling logic now depends entirely on precomputed `nextRun`
- Behavior may differ slightly for edge-case cron expressions due to new evaluation model

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.14](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.13...v0.3.14) - 2026-05-19

### 🩹 Fixes
- `Router.match()` and `Router.any()` not working - [#20](https://github.com/Bejibun-Framework/bejibun-core/pull/20)
- Fix route list for multiple method - [#22](https://github.com/Bejibun-Framework/bejibun-core/pull/22)

### 📖 Changes
- Added `config/route.ts` for route list config
- Added `bun ace route:list` for list all registered routes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.13](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.12...v0.3.13) - 2026-05-12

### 🩹 Fixes

### 📖 Changes
- Added global `config(key: string, defaultValue?: any)` for getting value from config path
- Added global `env(key: string)` for getting value from env file
- Added `config/performance.ts` to turn features into on/off for better performances

#### Upgrade [@bejibun/database](https://github.com/Bejibun-Framework/bejibun-database) to v0.1.20
[https://github.com/Bejibun-Framework/bejibun-database/releases/tag/v0.1.20](https://github.com/Bejibun-Framework/bejibun-database/releases/tag/v0.1.20)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.12](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.3.0...v0.3.12) - 2026-04-27

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) to v0.1.22
[https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.22](https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.22)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.3.0](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.17...v0.3.0) - 2026-04-22

### 🩹 Fixes

### 📖 Changes
#### Scheduler
- Added schedule worker `bun ace schedule:work`
- No overlapping

#### How to use?
```ts
// commands/Kernel.ts
import type Schedule from "@bejibun/core/facades/Schedule";

export default class Kernel {
    public schedule(schedule: Schedule): void {
        // Your code goes here
        schedule.command("hello:world").everyMinute();
    }
}
```

#### Available functions
- `.cron(cron: string)`
- `.everySecond()`
- `.everyTwoSeconds()`
- `.everyFiveSeconds()`
- `.everyTenSeconds()`
- `.everyFifteenSeconds()`
- `.everyTwentySeconds()`
- `.everyThirtySeconds()`
- `.everyMinute()`
- `.everyTwoMinutes()`
- `.everyThreeMinutes()`
- `.everyFourMinutes()`
- `.everyFiveMinutes()`
- `.everyTenMinutes()`
- `.everyFifteenMinutes()`
- `.everyThirtyMinutes()`
- `.hourly()`
- `.hourlyAt(minute: number)`
- `.everyOddHour(minute: number = 0)`
- `.everyTwoHours(minute: number = 0)`
- `.everyThreeHours(minute: number = 0)`
- `.everyFourHours(minute: number = 0)`
- `.everySixHours(minute: number = 0)`
- `.daily()`
- `.dailyAt(time: string)`
- `.twiceDaily(h1: number, h2: number)`
- `.twiceDailyAt(h1: number, h2: number, minute: number)`
- `.weekly()`
- `.weeklyOn(day: number, time: string)`
- `.monthly()`
- `.monthlyOn(day: number, time: string)`
- `.twiceMonthly(d1: number, d2: number, time: string)`
- `.yearly()`
- `.yearlyOn(month: number, day: number, time: string)`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.17](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.16...v0.2.17) - 2026-04-15

### 🩹 Fixes

### 📖 Changes
- Added route `/apis` for route list (powered by swagger)
- Added decorator kernel
- Added `@ApiDoc(config: ApiDocConfig)` decorator
```ts
type ApiDocConfig = {
    description: string | null | undefined;
    request: {
        params: {
            name: string;
            in: "header" | "path" | "query";
            required: boolean;
            schema: {
                type: "string";
            };
        }[];
    } | null | undefined;
    response: {
        [statusCode: number]: {
            description: string;
            content: {
                [contentType: string]: {
                    example: any;
                };
            };
        }[];
    } | null | undefined;
};
```

#### How to use?
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

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.16](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.15...v0.2.16) - 2026-03-18

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) to v0.1.20
[https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.20](https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.20)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.15](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.14...v0.2.15) - 2026-03-02

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) to v0.1.19
[https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.19](https://github.com/Bejibun-Framework/bejibun-cache/releases/tag/v0.1.19)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.14](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.13...v0.2.14) - 2026-02-27

### 🩹 Fixes

### 📖 Changes
- Added support transaction for soft deletes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.13](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.12...v0.2.13) - 2026-02-24

### 🩹 Fixes

### 📖 Changes
- Added storage options - [#18](https://github.com/Bejibun-Framework/bejibun-core/pull/18)

```ts
export type StorageOptions = {
    mode?: number;
    createPath?: boolean;
    acl?:
        | "private"
        | "public-read"
        | "public-read-write"
        | "aws-exec-read"
        | "authenticated-read"
        | "bucket-owner-read"
        | "bucket-owner-full-control"
        | "log-delivery-write";
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    endpoint?: string;
    virtualHostedStyle?: boolean;
    partSize?: number;
    queueSize?: number;
    retry?: number;
    type?: string;
    contentDisposition?: string | undefined;
    storageClass?:
        | "STANDARD"
        | "DEEP_ARCHIVE"
        | "EXPRESS_ONEZONE"
        | "GLACIER"
        | "GLACIER_IR"
        | "INTELLIGENT_TIERING"
        | "ONEZONE_IA"
        | "OUTPOSTS"
        | "REDUCED_REDUNDANCY"
        | "SNOW"
        | "STANDARD_IA";
    requestPayer?: boolean;
    highWaterMark?: number;
};
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.12](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.1...v0.2.12) - 2026-02-22

### 🩹 Fixes

### 📖 Changes
- Added backward compatibility for queue jobs.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.11](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.1...v0.2.11) - 2026-02-13

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/cors](https://github.com/Bejibun-Framework/bejibun-cors) to v0.1.17
[https://github.com/Bejibun-Framework/bejibun-cors/releases/tag/v0.1.17](https://github.com/Bejibun-Framework/bejibun-cors/releases/tag/v0.1.17)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.1](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.2.0...v0.2.1) - 2026-02-13

### 🩹 Fixes

### 📖 Changes
- Added `queue:flush` to flush all failed queue jobs.
- Added `queue:retry` to retry a failed queue job.
- Close database connection after using command.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.2.0](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.73...v0.2.0) - 2026-02-12

### 🩹 Fixes
- Invalid namespace for model - [#15](https://github.com/Bejibun-Framework/bejibun-core/issues/15)

### 📖 Changes
- Added dynamic model timestamps for `created_at`, `updated_at`, and `deleted_at`

#### Breaking Changes :
- No longer `BaseColumns` on `Model`

#### What's New :
- Epoch Timestamp Trait
- Job Dispatch
- Queue Worker

#### What is Epoch Timestamp Trait?
Override default model timestamps for `created_at`, `updated_at`, and `deleted_at` to unix timestamp.

Example :
```text
2026-01-01 12:00:00.000 +0000 -> 1767948151
```

#### How does Queue work?
When you dispatch job, system will add the job to database and save its params.

Then worker will run jobs on the database and called `handle` function with params from the database which saved before.

Worker only run jobs when the job is available by using `available_at`. You can also delay the job by passing `.delay(seconds)`

Example :
```ts
// Immediately
await TestJob.dispatch(/*any params here*/).send();

// With delay
await TestJob.dispatch(/*any params here*/).delay(60 * 10 /*10 minutes*/).send();
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.73](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.72...v0.1.73) - 2026-02-02

### 🩹 Fixes
- Fix infinite nested router - [#14](https://github.com/Bejibun-Framework/bejibun-core/pull/14)

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.72](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.71...v0.1.72) - 2026-01-29

### 🩹 Fixes

### 📖 Changes
- Added `setCustom(custom?: Record<string, any>)` on Response builder.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.71](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.70...v0.1.71) - 2026-01-29

### 🩹 Fixes
- Merge request payload json with other types

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.70](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.69...v0.1.70) - 2026-01-19

### 🩹 Fixes

### 📖 Changes
- Added S3 storage support - [#13](https://github.com/Bejibun-Framework/bejibun-core/pull/13)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.69](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.66...v0.1.69) - 2026-01-13

### 🩹 Fixes
- Router serialize raws into routes - [#11](https://github.com/Bejibun-Framework/bejibun-core/pull/11)

### 📖 Changes
- Added public URL - [#12](https://github.com/Bejibun-Framework/bejibun-core/pull/12)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.66](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.65...v0.1.66) - 2025-12-31

### 🩹 Fixes

### 📖 Changes
#### What's New :
- Added `Router.resource()`

Single line code that automatically generates a full set of CRUD.

#### How to use?
```ts
import Router from "@bejibun/core/facades/Router";
import YourController from "@/app/controllers/YourController";

Router.resource("path", YourController);
Router.resource("path", YourController, {
    only: ["index", "store"] // "index" | "store" | "show" | "update" | "destroy"
});
Router.resource("path", YourController, {
    except: ["index", "store"] // "index" | "store" | "show" | "update" | "destroy"
});
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.65](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.64...v0.1.65) - 2025-12-29

### 🩹 Fixes
- Router namespace on group - [#6](https://github.com/Bejibun-Framework/bejibun-core/issues/6)

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.64](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.61...v0.1.64) - 2025-12-25

### 🩹 Fixes

### 📖 Changes
#### What's New :
#### Storage
A filesystem facade, with built-in disk management including disks configuration and build disk at runtime.

- Standard Use
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.exists("path/to/your/file.ext"); // Check if the file exists
await Storage.missing("path/to/your/file.ext"); // Check if the file doesn't exists
await Storage.get("path/to/your/file.ext"); // Get data content
await Storage.put("path/to/your/file.ext", "content"); // Store content to file
await Storage.delete("path/to/your/file.ext"); // Delete file
```

- With Specified Disk
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.disk("public").exists("path/to/your/file.ext");
await Storage.disk("public").missing("path/to/your/file.ext");
await Storage.disk("public").get("path/to/your/file.ext");
await Storage.disk("public").put("path/to/your/file.ext", "content");
await Storage.disk("public").delete("path/to/your/file.ext");
```

- New Disk at Runtime
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.build({
    driver: "local", // "local" | DiskDriverEnum.Local
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
}).delete("path/to/your/file.ext");
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.61](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.58...v0.1.61) - 2025-12-12

### 🩹 Fixes
- [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) Redis connection with Cache own configuration - [#1](https://github.com/Bejibun-Framework/bejibun-core/issues/1)

### 📖 Changes
What's New :
#### Upgrade [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) to v0.1.14
- Adding `ttl` supports for file scheme.

#### How does it work?
When you use a cache and include a `ttl`, the system generates a `unix timestamp` and adds it with specified `ttl`.
Then system will write it to a file in the format `ttl|file`, separated by the `|` symbol.

When you call data from the cache, the system creates metadata consisting of the `ttl` and `data` by splitting them with `|`.
The system then checks if the `ttl` is empty and returns the data.

Or if the `ttl` is present, the system checks whether the `current timestamp` <= `ttl`?
If so, the data is returned. Otherwise, the cache file will be deleted and returned null.

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.60](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.58...v0.1.60) - 2025-12-10

### 🩹 Fixes
- [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) local with Rate Limiter - [#10](https://github.com/Bejibun-Framework/bejibun-core/issues/10)

### 📖 Changes

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.58](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.57...v0.1.58) - 2025-12-09

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/utils](https://github.com/Bejibun-Framework/bejibun-utils) to v0.1.25
- Implement `serialize` and `parseFormData` to `BaseController` for cleaner data and more actual data validation.

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.57](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.55...v0.1.57) - 2025-12-05

### 🩹 Fixes
- Hang, when redis not connected - [#7](https://github.com/Bejibun-Framework/bejibun-core/issues/7)
- Handling for invalid syntax validation - [#8](https://github.com/Bejibun-Framework/bejibun-core/issues/8)
- Body serialize for empty form data field - [#9](https://github.com/Bejibun-Framework/bejibun-core/issues/9)

#### [@bejibun/utils](https://github.com/Bejibun-Framework/bejibun-utils)
- Empty validation for file - [#1](https://github.com/Bejibun-Framework/bejibun-utils/issues/1)

### 📖 Changes
#### Upgrade [@bejibun/utils](https://github.com/Bejibun-Framework/bejibun-utils) to v0.1.23
- Empty validation for file

#### Upgrade [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) to v0.1.12
- Adding `local` connection for file schema.

Now, [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) has local and redis for cache system.
If the connection use local, this will cache data as file on storage/cache.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.55](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.54...v0.1.55) - 2025-11-29

### 🩹 Fixes
- Body parser for multiple keys - [#2](https://github.com/Bejibun-Framework/bejibun-core/issues/2)
- x402 on nester router - [#3](https://github.com/Bejibun-Framework/bejibun-core/issues/3)
- Storage directory undefined - [#4](https://github.com/Bejibun-Framework/bejibun-core/issues/4)
- Unknown actual error on runtime exception - [#5](https://github.com/Bejibun-Framework/bejibun-core/issues/5)

### 📖 Changes
- Storage adjustment: random string filename.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.54](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.53...v0.1.54) - 2025-11-28

### 🩹 Fixes
- Fix x402 middleware for optional

### 📖 Changes

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.53](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.52...v0.1.53) - 2025-11-24

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `Rate Limiter` to limit any action in a certain time.

Available `Rate Limiter` functions :
- `.attempt(key, limit, callback, duration)` throw an error if limit reached.
- `.tooManyAttempts(key, limit, duration)` method to check if limit has reached.
- `.clear(key)` reset the counter.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.52](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.51...v0.1.52) - 2025-11-17

### 🩹 Fixes

### 📖 Changes
What's New :

Adding support for x402 protocol. You can secure your paid endpoint by adding `.x402()` chaining on router.

How to use it :

First, you need to install the package by running `bun ace install @bejibun/x402`.

Customize your `config/x402.ts` with your own configuration.

Add `.x402()` chain into router you want to add for payment middleware.
```ts
Router.x402()
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.51](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.49...v0.1.51) - 2025-11-04

### 🩹 Fixes

### 📖 Changes
What's New :

Everyone can create their own packages,
and now `Bejibun` support for commands from external packages
and can be added to `config/command.ts`.

```ts
const config: Array<Record<string, any>> = [
    /*
    {
        path: "your-dependencies/your-directory-commands",
        path: "@bejibun/database/commands" // Example
    }
    */
];

export default config;
```

Or the external package itself can automatically add them to `config/command.ts`
using the configuration package by creating `configure.ts` in your package root.

When the user runs `bun ace install your-package` it will automatically run the configuration package.

So when user runs `bun ace` your command will appear in the list.

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.49](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.47...v0.1.49) - 2025-10-27

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `make:model <file>` to create a new model file
- Adding `make:validator <file>` to create a new validator file

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.47](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.44...v0.1.47) - 2025-10-26

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `make:command <file>` to create a new command file
- Adding `make:controller <file>` to create a new controller file
- Adding `make:middleware <file>` to create a new middleware file

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.44](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.43...v0.1.44) - 2025-10-22

### 🩹 Fixes

### 📖 Changes
What's New :
- Move related database into `@bejibun/database`
- Adding `install <packages...>` to install package dependencies
- Adding `package:configure` to run package configuration file
- Now, everyone can build their own package for Bejibun framework

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.43](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.42...v0.1.43) - 2025-10-21

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `maintenance:down` to turn app into maintenance mode
- Adding `maintenance:up` to turn app into live mode
- Adding maintenance middleware

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.42](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.41...v0.1.42) - 2025-10-21

### 🩹 Fixes
- Fix controller path on router builder

### 📖 Changes
What's New :
- Adding base exception handler
- Adding runtime exception
- Adding `server.ts` for init serve

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.41](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.40...v0.1.41) - 2025-10-20

### 🩹 Fixes

### 📖 Changes
Chore :
- Refactor some codes to bun native
- Adding log when throwing exceptions

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.40](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.39...v0.1.40) - 2025-10-19

### 🩹 Fixes
- Fix router any invalid route structure

### 📖 Changes
What's New :
- Support commands from your root bejibun framework
- Support nested directory commands
- Adding router namespace

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.39](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.38...v0.1.39) - 2025-10-17

### 🩹 Fixes
- Fix load database configuration on bootstrap & base model

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.38](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.36...v0.1.38) - 2025-10-17

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `ace` for commands
- Adding commands directory structure

Available Commands :
- `db:seed` Run database seeders
- `migrate:fresh` Rollback all migrations and re-run migrations
- `migrate:latest` Run latest migration
- `migrate:rollback` Rollback the latest migrations
- `migrate:status` List migrations status

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.36](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.35...v0.1.36) - 2025-10-14

### 🩹 Fixes

### 📖 Changes
What's New :
- Include `@bejibun/logger` for default

Refactors :
- Move cors into `@bejibun/cors`
- Move utils and enums into `@bejibun/utils`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.35](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.23...v0.1.35) - 2025-10-14

### 🩹 Fixes

### 📖 Changes
What's New :
Update build indexing

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.23](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.18...v0.1.23) - 2025-10-14

### 🩹 Fixes

### 📖 Changes
What's New :
- Base class (Controller, Model, Validator)
- Bootstrap for startup load
- Adding some utils (Chalk, Response, Router, Soft Deletes)
- Adding some types (Middleware, Router, Validator, etc)
- Vine validation macro for `exists` and `unique`
- Adding validation exception

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.18](https://github.com/Bejibun-Framework/bejibun-core/compare/v0.1.0...v0.1.18) - 2025-10-12

### 🩹 Fixes

### 📖 Changes
What's New :
- Enum helper
- Str helper
- Some util functions

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-core/blob/master/CHANGELOG.md