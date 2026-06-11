import Logger from "@bejibun/logger";
import { isEmpty } from "@bejibun/utils";
import path from "path";
import DiskException from "../../exceptions/DiskException";
export default class StorageLocalBuilder {
    _config;
    constructor(config) {
        this._config = config;
    }
    get config() {
        if (isEmpty(this._config.root))
            throw new DiskException(`Missing "root" for "local" disk configuration.`);
        return this._config;
    }
    async exists(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await Bun.file(path.resolve(this.config.root, filepath)).exists();
    }
    async missing(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return !await this.exists(filepath);
    }
    async get(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return Bun.file(path.resolve(this.config.root, filepath));
    }
    async put(filepath, content, options) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        if (isEmpty(content))
            throw new DiskException("The content is required.");
        try {
            await Bun.write(path.resolve(this.config.root, filepath), content, options);
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
        await Bun.file(path.resolve(this.config.root, filepath)).delete();
    }
}
