import Str from "@bejibun/utils/facades/Str";
import {program} from "commander";
import os from "os";
import Kernel from "@/commands/Kernel";
import {version} from "package.json";

const commandExec = "ace";

program
    .name(commandExec)
    .version(version, "-v, --version", "Show the current version")
    .description(`${Str.toPascalCase(commandExec)} for your commander${os.EOL}Author: Havea Crenata <havea.crenata@gmail.com>`)
    .addHelpText("after", [
        `${os.EOL}Examples:`,
        `$ bun ${commandExec} --help`,
        `$ bun ${commandExec} --version`,
        `$ bun ${commandExec} migrate:latest`
    ].join(`${os.EOL}  `));

Kernel.registerCommands(program);

program.parse();