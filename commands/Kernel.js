import App from "@bejibun/app";
import { defineValue, isEmpty } from "@bejibun/utils";
import { readdirSync } from "fs";
import path from "path";
export default class Kernel {
    static registerCommands(program) {
        const commandsDirectoryCore = path.resolve(__dirname);
        const files = this.commands(commandsDirectoryCore)
            .concat(this.commands(App.commandsPath()));
        for (const file of files) {
            const { default: CommandClass } = require(file);
            const instance = new CommandClass();
            if (isEmpty(instance.$signature) || typeof instance.handle !== "function")
                continue;
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
                const positionalArgs = args.slice(0, -1);
                await instance.handle(options, positionalArgs);
            });
        }
    }
    static commands(directory) {
        const entries = readdirSync(directory, {
            withFileTypes: true
        });
        const files = [];
        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...this.commands(fullPath));
            }
            else if (/\.(m?js|ts)$/.test(entry.name) &&
                !entry.name.endsWith(".d.ts") &&
                !entry.name.includes("Kernel")) {
                files.push(fullPath);
            }
        }
        return files;
    }
}
