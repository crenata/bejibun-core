import type { Command } from "commander";
export default class Kernel {
    static registerCommands(program: Command): void;
    private static commands;
}
