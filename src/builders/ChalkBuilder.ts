import chalk from "chalk";
import os from "os";

export default class ChalkBuilder {
    protected value: string;
    protected isNewLine: boolean;
    protected clk: any;

    public constructor() {
        this.value = "";
        this.isNewLine = true;
    }

    public setValue(value: string): ChalkBuilder {
        this.value = value;

        return this;
    }

    public inline(): ChalkBuilder {
        this.isNewLine = false;

        return this;
    }

    public bold(): ChalkBuilder {
        if (this.clk) this.clk = this.clk.bold;
        else this.clk = chalk.bold;

        return this;
    }

    public danger(): ChalkBuilder {
        if (this.clk) this.clk = this.clk.red;
        else this.clk = chalk.red;

        return this;
    }

    public info(): ChalkBuilder {
        if (this.clk) this.clk = this.clk.hex("#0CCAF0");
        else this.clk = chalk.hex("#0CCAF0");

        return this;
    }

    public line(): void {
        console.log("-".repeat(process.stdout.columns));
    }

    public show(): string {
        return this.clk(this._value);
    }

    private get _value(): string {
        if (this.isNewLine) return `${this.value}${os.EOL}`;

        return this.value;
    }
}