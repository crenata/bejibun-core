import StorageBuilder from "../builders/StorageBuilder";
export default class Storage {
    static build(disk) {
        return new StorageBuilder().build(disk);
    }
    static disk(disk) {
        return new StorageBuilder().disk(disk);
    }
    static async get(path) {
        return await new StorageBuilder().get(path);
    }
    static async put(path, content) {
        return await new StorageBuilder().put(path, content);
    }
}
