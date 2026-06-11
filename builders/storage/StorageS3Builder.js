import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import DiskException from "../../exceptions/DiskException";
export default class StorageS3Builder {
    _config;
    client;
    constructor(config) {
        this._config = config;
        this.client = new Bun.S3Client({
            endpoint: this.config.endpoint,
            region: this.config.region,
            bucket: this.config.bucket,
            accessKeyId: this.config.access_key_id,
            secretAccessKey: this.config.secret_access_key
        });
    }
    get config() {
        if (isEmpty(this._config.endpoint))
            throw new DiskException(`Missing "endpoint" for "s3" disk configuration.`);
        if (isEmpty(this._config.access_key_id))
            throw new DiskException(`Missing "access_key_id" for "s3" disk configuration.`);
        if (isEmpty(this._config.secret_access_key))
            throw new DiskException(`Missing "secret_access_key" for "s3" disk configuration.`);
        return this._config;
    }
    async exists(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.client.file(filepath).exists();
    }
    async missing(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return !await this.exists(filepath);
    }
    async get(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return this.client.file(filepath);
    }
    async put(filepath, content, options) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        if (isEmpty(content))
            throw new DiskException("The content is required.");
        try {
            await this.client.write(filepath, content, options);
        }
        catch (error) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }
    async copy(source, destination, options) {
        if (isEmpty(source))
            throw new DiskException("The source file path is required.");
        if (isEmpty(destination))
            throw new DiskException("The destination file path is required.");
        try {
            await this.put(destination, await this.get(source), options);
        }
        catch (error) {
            Logger.setContext("Storage").error("Something went wrong when copying file.").trace(error);
        }
    }
    async move(source, destination, options) {
        if (isEmpty(source))
            throw new DiskException("The source file path is required.");
        if (isEmpty(destination))
            throw new DiskException("The destination file path is required.");
        try {
            await this.copy(source, destination, options);
            await this.delete(source);
        }
        catch (error) {
            Logger.setContext("Storage").error("Something went wrong when moving file.").trace(error);
        }
    }
    async delete(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        await this.client.file(filepath).delete();
    }
}
