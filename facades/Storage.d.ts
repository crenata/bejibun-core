import StorageBuilder from "../builders/StorageBuilder";
import { StorageDisk } from "../types/storage";
export default class Storage {
    static build(disk: StorageDisk): StorageBuilder;
    static disk(disk: string): StorageBuilder;
    static get(path: string): Promise<any>;
    static put(path: string, content: any): Promise<void>;
}
