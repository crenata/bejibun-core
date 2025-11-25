export default class StorageBuilder {
    protected file: any;
    protected directory?: string;
    protected name?: string;
    constructor();
    setFile(file: any): StorageBuilder;
    setDirectory(directory: string): StorageBuilder;
    setName(name: string): StorageBuilder;
    save(): Promise<any>;
}
