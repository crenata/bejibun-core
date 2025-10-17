import { defineValue, isEmpty } from "@bejibun/utils";
import { readdirSync } from "fs";
import path from "path";
export default class Kernel {
    static registerCommands(program) {
        const commandsDir = path.resolve(__dirname);
        const files = readdirSync(commandsDir).filter((file) => {
            return (/\.(m?js|ts)$/.test(file) &&
                !file.endsWith(".d.ts") &&
                !file.includes("Kernel"));
        });
        for (const file of files) {
            const modulePath = path.join(commandsDir, file);
            const { default: CommandClass } = require(modulePath);
            const instance = new CommandClass();
            if (isEmpty(instance.$signature) || typeof instance.handle !== "function")
                continue;
            const cmd = program
                .command(instance.$signature)
                .description(defineValue(instance.$description, ""))
                .action(instance.handle);
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
                const lastArg = args[args.length - 1];
                const options = defineValue(lastArg, {});
                await instance.handle(options, args.slice(0, -1));
            });
        }
    }
}
