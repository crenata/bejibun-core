import type {Command} from "commander";
import App from "@bejibun/app";
import {defineValue, isEmpty} from "@bejibun/utils";

export default class Kernel {
    public static registerCommands(program: Command): void {
        const paths: Array<Record<string, any>> = [
            {
                absolute: true,
                cwd: App.Path.commandsPath()
            },
            {
                absolute: true,
                cwd: __dirname
            },
            {
                absolute: true,
                cwd: "node_modules/@bejibun/database/commands"
            }
        ];
        const files: Array<string> = paths
            .map(value => Array.from(new Bun.Glob("**/*").scanSync({
                absolute: value.absolute,
                cwd: value.cwd
            })))
            .flat()
            .filter(value => (
                /\.(m?js|ts)$/.test(value) &&
                !value.endsWith(".d.ts") &&
                !value.includes("Kernel")
            ));

        const instances: Array<any> = [];

        for (const file of files) {
            const {default: CommandClass} = require(file);

            const instance = new CommandClass();

            if (isEmpty(instance.$signature) || typeof instance.handle !== "function") continue;

            instances.push(instance);
        }

        for (const instance of instances.sort((a, b) => a.$signature.localeCompare(b.$signature))) {
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
                const positionalArgs = args[0];
                await instance.handle(options, positionalArgs);
            });
        }
    }
}