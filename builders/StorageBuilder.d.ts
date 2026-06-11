import type { StorageDisk, StorageOptions } from "../types/storage";
export default class StorageBuilder {
    protected conf: Record<string, any>;
    protected overrideDisk?: StorageDisk;
    protected drive?: string;
    constructor();
    private get config();
    private get currentDisk();
    private get driver();
    build(overrideDisk: StorageDisk): StorageBuilder;
    disk(drive: string): StorageBuilder;
    exists(filepath: string): Promise<boolean>;
    missing(filepath: string): Promise<boolean>;
    get(filepath: string): Promise<Bun.BunFile | Bun.S3File>;
    put(filepath: string, content: any, options?: StorageOptions): Promise<void>;
    copy(source: string, destination: string, options?: StorageOptions): Promise<void>;
    move(source: string, destination: string, options?: StorageOptions): Promise<void>;
    delete(filepath: string): Promise<void>;
}
