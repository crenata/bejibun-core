import NamespaceBuilder from "@/builders/NamespaceBuilder";

export default class NamespaceLoader {
    public static async load(directory: string): Promise<void> {
        return await new NamespaceBuilder().load(directory);
    }
}
