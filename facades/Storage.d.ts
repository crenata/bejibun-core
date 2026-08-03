import type { Stats } from "fs";
import type { StorageDisk, StorageOptions } from "../types/storage";
import StorageBuilder from "../builders/StorageBuilder";
export default class Storage {
    static build(disk: StorageDisk): StorageBuilder;
    static disk(disk: string): StorageBuilder;
    static exists(path: string): Promise<boolean>;
    static missing(path: string): Promise<boolean>;
    static metadata(path: string): Promise<Stats | Bun.S3Stats>;
    static size(path: string): Promise<number>;
    static mimeType(path: string): Promise<string>;
    static lastModified(path: string): Promise<Date>;
    static get(path: string): Promise<Bun.BunFile | Bun.S3File>;
    static put(path: string, content: any, options?: StorageOptions): Promise<void>;
    static copy(source: string, destination: string, options?: StorageOptions): Promise<void>;
    static move(source: string, destination: string, options?: StorageOptions): Promise<void>;
    static delete(path: string): Promise<any>;
}
