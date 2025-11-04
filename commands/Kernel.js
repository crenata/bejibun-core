import App from "@bejibun/app";
import { defineValue, isEmpty } from "@bejibun/utils";
export default class Kernel {
    static registerCommands(program) {
        const rootCommands = require(App.Path.configPath("command.ts")).default;
        const paths = [
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
        ].concat(rootCommands.map(value => ({
            absolute: true,
            cwd: `node_modules/${value.path}`
        })));
        const files = paths
            .map(value => Array.from(new Bun.Glob("**/*").scanSync({
            absolute: value.absolute,
            cwd: value.cwd
        })))
            .flat()
            .filter(value => (/\.(m?js|ts)$/.test(value) &&
            !value.endsWith(".d.ts") &&
            !value.includes("Kernel")));
        const instances = [];
        for (const file of files) {
            const { default: CommandClass } = require(file);
            const instance = new CommandClass();
            if (isEmpty(instance.$signature) || typeof instance.handle !== "function")
                continue;
            instances.push(instance);
        }
        for (const instance of instances.sort((a, b) => a.$signature.localeCompare(b.$signature))) {
            const cmd = program
                .command(instance.$signature)
                .description(defineValue(instance.$description, ""));
            if (Array.isArray(instance.$options)) {
                for (const option of instance.$options) {
                    cmd.option(...option);
                }
            }
            if (Array.isArray(instance.$arguments)) {
                for (const argument of instance.$arguments) {
                    cmd.argument(...argument);
                }
            }
            cmd.action(async (...args) => {
                const commandObj = args[args.length - 1];
                const options = typeof commandObj.opts === "function" ? commandObj.opts() : commandObj;
                const positionalArgs = args[0];
                await instance.handle(options, positionalArgs);
            });
        }
    }
}
