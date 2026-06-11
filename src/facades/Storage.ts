import type {StorageDisk, StorageOptions} from "@/types/storage";
import StorageBuilder from "@/builders/StorageBuilder";

export default class Storage {
    public static build(disk: StorageDisk): StorageBuilder {
        return new StorageBuilder().build(disk);
    }

    public static disk(disk: string): StorageBuilder {
        return new StorageBuilder().disk(disk);
    }

    public static async exists(path: string): Promise<boolean> {
        return await new StorageBuilder().exists(path);
    }

    public static async missing(path: string): Promise<boolean> {
        return await new StorageBuilder().missing(path);
    }

    public static async get(path: string): Promise<Bun.BunFile | Bun.S3File> {
        return await new StorageBuilder().get(path);
    }

    public static async put(path: string, content: any, options?: StorageOptions): Promise<void> {
        return await new StorageBuilder().put(path, content);
    }

    public static async copy(source: string, destination: string, options?: StorageOptions): Promise<void> {
        return await new StorageBuilder().copy(source, destination, options);
    }

    public static async move(source: string, destination: string, options?: StorageOptions): Promise<void> {
        return await new StorageBuilder().move(source, destination, options);
    }

    public static async delete(path: string): Promise<any> {
        return await new StorageBuilder().delete(path);
    }
}