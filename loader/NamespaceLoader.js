import NamespaceBuilder from "../builders/NamespaceBuilder";
export default class NamespaceLoader {
    static async load(directory) {
        return await new NamespaceBuilder().load(directory);
    }
}
