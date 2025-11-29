# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.55](https://github.com/crenata/bejibun-core/compare/v0.1.54...v0.1.55) - 2025-11-29

### 🩹 Fixes
- Body parser for multiple keys - [#2](https://github.com/crenata/bejibun-core/issues/2)
- x402 on nester router - [#3](https://github.com/crenata/bejibun-core/issues/3)
- Storage directory undefined - [#4](https://github.com/crenata/bejibun-core/issues/4)
- Unknown actual error on runtime exception - [#5](https://github.com/crenata/bejibun-core/issues/5)

### 📖 Changes
- Storage adjustment: random string filename.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.54](https://github.com/crenata/bejibun-core/compare/v0.1.53...v0.1.54) - 2025-11-28

### 🩹 Fixes
- Fix x402 middleware for optional

### 📖 Changes

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.53](https://github.com/crenata/bejibun-core/compare/v0.1.52...v0.1.53) - 2025-11-24

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.52](https://github.com/crenata/bejibun-core/compare/v0.1.51...v0.1.52) - 2025-11-17

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.51](https://github.com/crenata/bejibun-core/compare/v0.1.49...v0.1.51) - 2025-11-04

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.49](https://github.com/crenata/bejibun-core/compare/v0.1.47...v0.1.49) - 2025-10-27

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `make:model <file>` to create a new model file
- Adding `make:validator <file>` to create a new validator file

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.47](https://github.com/crenata/bejibun-core/compare/v0.1.44...v0.1.47) - 2025-10-26

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `make:command <file>` to create a new command file
- Adding `make:controller <file>` to create a new controller file
- Adding `make:middleware <file>` to create a new middleware file

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.44](https://github.com/crenata/bejibun-core/compare/v0.1.43...v0.1.44) - 2025-10-22

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.43](https://github.com/crenata/bejibun-core/compare/v0.1.42...v0.1.43) - 2025-10-21

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `maintenance:down` to turn app into maintenance mode
- Adding `maintenance:up` to turn app into live mode
- Adding maintenance middleware

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.42](https://github.com/crenata/bejibun-core/compare/v0.1.41...v0.1.42) - 2025-10-21

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.41](https://github.com/crenata/bejibun-core/compare/v0.1.40...v0.1.41) - 2025-10-20

### 🩹 Fixes

### 📖 Changes
Chore :
- Refactor some codes to bun native
- Adding log when throwing exceptions

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.40](https://github.com/crenata/bejibun-core/compare/v0.1.39...v0.1.40) - 2025-10-19

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.39](https://github.com/crenata/bejibun-core/compare/v0.1.38...v0.1.39) - 2025-10-17

### 🩹 Fixes
- Fix load database configuration on bootstrap & base model

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.38](https://github.com/crenata/bejibun-core/compare/v0.1.36...v0.1.38) - 2025-10-17

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.36](https://github.com/crenata/bejibun-core/compare/v0.1.35...v0.1.36) - 2025-10-14

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.35](https://github.com/crenata/bejibun-core/compare/v0.1.23...v0.1.35) - 2025-10-14

### 🩹 Fixes

### 📖 Changes
What's New :
Update build indexing

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.23](https://github.com/crenata/bejibun-core/compare/v0.1.18...v0.1.23) - 2025-10-14

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

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md

---

## [v0.1.18](https://github.com/crenata/bejibun-core/compare/v0.1.0...v0.1.18) - 2025-10-12

### 🩹 Fixes

### 📖 Changes
What's New :
- Enum helper
- Str helper
- Some util functions

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-core/blob/master/CHANGELOG.md