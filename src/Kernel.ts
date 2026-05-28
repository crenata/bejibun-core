import type {Command} from "commander";
import App from "@bejibun/app";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import path from "path";
import BaseModel from "@/bases/BaseModel";
import RuntimeException from "@/exceptions/RuntimeException";
import Schedule from "@/facades/Schedule";
import WebSocketLoader from "@/loader/WebSocketLoader";

export default class Kernel {
    public static registerCommands(program: Command): void {
        const rootCommands: Array<{ path: string }> = require(App.Path.configPath("command.ts")).default;
        const paths: Array<Record<string, any>> = [
            {
                absolute: true,
                cwd: App.Path.commandsPath()
            },
            {
                absolute: true,
                cwd: path.resolve(__dirname, "commands")
            },
            {
                absolute: true,
                cwd: "node_modules/@bejibun/database/commands"
            }
        ].concat(rootCommands.map(value => ({
            absolute: true,
            cwd: `node_modules/${value.path}`
        })));
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
                try {
                    await instance.handle(options, positionalArgs);
                } finally {
                    await BaseModel.knex().destroy();
                }
            });
        }
    }

    public static registerSchedulers(): void {
        const kernelPath: string = App.Path.commandsPath("Kernel.ts");
        const {default: Kernel} = require(kernelPath);

        if (isEmpty(Kernel)) throw new RuntimeException(`Kernel class not found [${kernelPath}].`);

        const instance = new Kernel();
        if (typeof instance.schedule !== "function") throw new RuntimeException(`Kernel class has no schedule function in [${kernelPath}].`);

        instance.schedule(Schedule);
    }

    public static registerDecorator(): void {
        const paths: Array<Record<string, any>> = [
            {
                absolute: true,
                cwd: path.resolve(__dirname, "decorators")
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

        for (const file of files) {
            const {default: decorator} = require(file);

            if (typeof decorator !== "function") continue;

            if (isNotEmpty(decorator.name)) (globalThis as any)[decorator.name.replace("Decorator", "")] = decorator;
        }
    }

    public static registerWebSockets(): void {
        const files: Array<string> = Array.from(new Bun.Glob("**/*")
            .scanSync({
                absolute: true,
                cwd: App.Path.appPath("websockets")
            }))
            .flat()
            .filter(value => (
                /\.(m?js|ts)$/.test(value) &&
                !value.endsWith(".d.ts")
            ));

        for (const file of files) {
            const {default: WebSocketClass} = require(file);

            WebSocketLoader.add(WebSocketClass);
        }
    }
}