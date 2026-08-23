import type { Command } from "commander";
/**
 * Framework bootstrap kernel. Provides the static registration routines
 * invoked during application startup to wire up the Commander CLI,
 * cron-style schedulers, custom decorators, and WebSocket handlers -
 * all discovered by scanning the filesystem rather than requiring
 * manual imports.
 */
export default class Kernel {
    /**
     * Discovers and registers every Ace command with the given Commander
     * `program` instance.
     *
     * Scans three locations for command files: the application's own
     * `commands` directory, this package's bundled `commands` directory,
     * and `node_modules/@bejibun/database/commands`, plus any additional
     * package command paths declared in `config/command.ts`. Each
     * discovered file is required, instantiated, and skipped unless it
     * exposes both a `$signature` and a `handle()` method. Valid commands
     * are sorted alphabetically by signature and registered on `program`
     * with their options/arguments, wiring `handle()` as the action
     * callback and ensuring the DB connection (`BaseModel.knex()`) is
     * destroyed afterward regardless of success or failure.
     *
     * @param program - The Commander program to register commands on.
     */
    static registerCommands(program: Command): void;
    /**
     * Loads the application's `app/commands/Kernel.ts` (the user-defined
     * kernel, distinct from this framework `Kernel`), instantiates it,
     * and invokes its `schedule()` method with the `Schedule` facade so
     * the application can register its cron-style scheduled tasks.
     *
     * @throws {RuntimeException} If the application's Kernel class or its `schedule()` method can't be found.
     */
    static registerSchedulers(): void;
    /**
     * Scans this package's `decorators` directory and registers each
     * exported decorator function as a global, keyed by its function name
     * with the `Decorator` suffix stripped (e.g. `ApiDocDecorator` becomes
     * the global `ApiDoc`).
     */
    static registerDecorator(): void;
    /**
     * Scans the application's `app/websockets` directory and registers
     * every discovered WebSocket handler class with `WebSocketLoader`, so
     * incoming upgrade requests can be routed to the correct handler.
     */
    static registerWebSockets(): void;
}
