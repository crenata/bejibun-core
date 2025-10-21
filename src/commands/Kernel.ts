import type {Command} from "commander";
import App from "@bejibun/app";
import {defineValue, isEmpty} from "@bejibun/utils";

export default class Kernel {
    public static registerCommands(program: Command): void {
        const rootCommands = Array.from(new Bun.Glob("**/*.ts").scanSync({
            absolute: true,
            cwd: App.Path.commandsPath()
        }));
        const internalCommands = Array.from(new Bun.Glob("**/*").scanSync({
            absolute: true,
            cwd: __dirname
        }));
        const files = internalCommands.concat(rootCommands).filter(value => (
            /\.(m?js|ts)$/.test(value) &&
            !value.endsWith(".d.ts") &&
            !value.includes("Kernel")
        )).reverse();

        for (const file of files) {
            const {default: CommandClass} = require(file);

            const instance = new CommandClass();

            if (isEmpty(instance.$signature) || typeof instance.handle !== "function") continue;

            const cmd = program
                .command(instance.$signature)
                .description(defineValue(instance.$description, ""));

            if (Array.isArray(instance.$options)) {
                for (const option of instance.$options) {
                    cmd.option(...(option as [string, string?, any?]));
                }
            }

            if (Array.isArray(instance.$arguments)) {
                for (const argument of instance.$arguments) {
                    cmd.argument(...(argument as [string, string?, unknown?]));
                }
            }

            cmd.action(async (...args: Array<any>) => {
                const commandObj = args[args.length - 1];
                const options = typeof commandObj.opts === "function" ? commandObj.opts() : commandObj;
                const positionalArgs = args.slice(0, -1);
                await instance.handle(options, positionalArgs);
            });
        }
    }
}