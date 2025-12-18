import { StorageDisk } from "../types/storage";
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
    get(filepath: string): Promise<any>;
    put(filepath: string, content: any): Promise<void>;
}
