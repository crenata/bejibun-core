import type {StorageDriver, StorageOptions} from "@/types/storage";
import Logger from "@bejibun/logger";
import {isEmpty} from "@bejibun/utils";
import DiskException from "@/exceptions/DiskException";

export default class StorageS3Builder implements StorageDriver {
    protected _config: Record<string, any>;
    protected client: Bun.S3Client;

    public constructor(config: Record<string, any>) {
        this._config = config;
        this.client = new Bun.S3Client({
            endpoint: this.config.endpoint,
            region: this.config.region,
            bucket: this.config.bucket,
            accessKeyId: this.config.access_key_id,
            secretAccessKey: this.config.secret_access_key
        });
    }

    private get config(): Record<string, any> {
        if (isEmpty(this._config.endpoint)) throw new DiskException(`Missing "endpoint" for "s3" disk configuration.`);
        if (isEmpty(this._config.access_key_id)) throw new DiskException(`Missing "access_key_id" for "s3" disk configuration.`);
        if (isEmpty(this._config.secret_access_key)) throw new DiskException(`Missing "secret_access_key" for "s3" disk configuration.`);

        return this._config;
    }

    public async exists(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return await this.client.file(filepath).exists();
    }

    public async missing(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return !await this.exists(filepath);
    }

    public async metadata(filepath: string): Promise<Bun.S3Stats> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return await (await this.get(filepath)).stat();
    }

    public async size(filepath: string): Promise<number> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return (await this.metadata(filepath)).size;
    }

    public async mimeType(filepath: string): Promise<string> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return (await this.metadata(filepath)).type;
    }

    public async lastModified(filepath: string): Promise<Date> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return (await this.metadata(filepath)).lastModified;
    }

    public async get(filepath: string): Promise<Bun.S3File> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return this.client.file(filepath);
    }

    public async put(filepath: string, content: any, options?: StorageOptions): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");
        if (isEmpty(content)) throw new DiskException("The content is required.");

        try {
            await this.client.write(filepath, content, options);
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

        await this.client.file(filepath).delete();
    }
}