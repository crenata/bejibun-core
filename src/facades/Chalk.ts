import ChalkBuilder from "@/builders/ChalkBuilder";

export default class Chalk {
    public static setValue(value: string): ChalkBuilder {
        return new ChalkBuilder().setValue(value);
    }
}