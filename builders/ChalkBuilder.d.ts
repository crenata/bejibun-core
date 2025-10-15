export default class ChalkBuilder {
    protected value: string;
    protected isNewLine: boolean;
    protected clk: any;
    constructor();
    setValue(value: string): ChalkBuilder;
    inline(): ChalkBuilder;
    bold(): ChalkBuilder;
    danger(): ChalkBuilder;
    info(): ChalkBuilder;
    line(): void;
    show(): string;
    private get _value();
}
