import type {StorageDriver, StorageOptions} from "@/types/storage";
import Logger from "@bejibun/logger";
import {isEmpty} from "@bejibun/utils";
import path from "path";
import DiskException from "@/exceptions/DiskException";

export default class StorageLocalBuilder implements StorageDriver {
    protected _config: Record<string, any>;

    public constructor(config: Record<string, any>) {
        this._config = config;
    }

    private get config(): Record<string, any> {
        if (isEmpty(this._config.root)) throw new DiskException(`Missing "root" for "local" disk configuration.`);

        return this._config;
    }

    public async exists(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return await Bun.file(path.resolve(this.config.root, filepath)).exists();
    }

    public async missing(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return !await this.exists(filepath);
    }

    public async get(filepath: string): Promise<Bun.BunFile> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return Bun.file(path.resolve(this.config.root, filepath));
    }

    public async put(filepath: string, content: any, options?: StorageOptions): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");
        if (isEmpty(content)) throw new DiskException("The content is required.");

        try {
            await Bun.write(path.resolve(this.config.root, filepath), content, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }

    public async copy(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new DiskException("The source file path is required.");
        if (isEmpty(destination)) throw new DiskException("The destination file path is required.");

        try {
            await this.put(destination, await this.get(source), options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when copying file.").trace(error);
        }
    }

    public async move(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new DiskException("The source file path is required.");
        if (isEmpty(destination)) throw new DiskException("The destination file path is required.");

        try {
            await this.copy(source, destination, options);

            await this.delete(source);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when moving file.").trace(error);
        }
    }

    public async delete(filepath: string): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        await Bun.file(path.resolve(this.config.root, filepath)).delete();
    }
}