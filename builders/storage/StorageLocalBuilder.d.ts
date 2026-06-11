import type { StorageDriver, StorageOptions } from "../../types/storage";
export default class StorageLocalBuilder implements StorageDriver {
    protected _config: Record<string, any>;
    constructor(config: Record<string, any>);
    private get config();
    exists(filepath: string): Promise<boolean>;
    missing(filepath: string): Promise<boolean>;
    get(filepath: string): Promise<Bun.BunFile>;
    put(filepath: string, content: any, options?: StorageOptions): Promise<void>;
    copy(source: string, destination: string, options?: StorageOptions): Promise<void>;
    move(source: string, destination: string, options?: StorageOptions): Promise<void>;
    delete(filepath: string): Promise<void>;
}
