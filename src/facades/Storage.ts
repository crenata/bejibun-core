import StorageBuilder from "@/builders/StorageBuilder";
import {StorageDisk} from "@/types/storage";

export default class Storage {
    public static build(disk: StorageDisk): StorageBuilder {
        return new StorageBuilder().build(disk);
    }

    public static disk(disk: string): StorageBuilder {
        return new StorageBuilder().disk(disk);
    }

    public static async get(path: string): Promise<any> {
        return await new StorageBuilder().get(path);
    }

    public static async put(path: string, content: any): Promise<void> {
        return await new StorageBuilder().put(path, content);
    }
}