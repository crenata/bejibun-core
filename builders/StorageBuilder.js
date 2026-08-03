import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import fs from "fs";
import StorageLocalBuilder from "../builders/storage/StorageLocalBuilder";
import StorageS3Builder from "../builders/storage/StorageS3Builder";
import DiskConfig from "../config/disk";
import DiskException from "../exceptions/DiskException";
import DiskDriverEnum from "../enums/DiskDriverEnum";
export default class StorageBuilder {
    conf;
    overrideDisk;
    drive;
    constructor() {
        const configPath = App.Path.configPath("disk.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = DiskConfig;
        this.conf = config;
    }
    get config() {
        if (isEmpty(this.conf))
            throw new DiskException("There is no config provided.");
        return this.conf;
    }
    get currentDisk() {
        return defineValue(this.overrideDisk, this.config.disks[defineValue(this.drive, this.config.default)]);
    }
    get driver() {
        const driver = defineValue(this.currentDisk?.driver);
        if (isEmpty(driver))
            throw new DiskException(`Missing "driver" on disk config.`);
        if (!Enum.setEnums(DiskDriverEnum).hasValue(driver))
            throw new DiskException(`Not supported "driver" disk.`);
        switch (driver) {
            case DiskDriverEnum.Local:
                return new StorageLocalBuilder(this.currentDisk);
            case DiskDriverEnum.S3:
                return new StorageS3Builder(this.currentDisk);
            default:
                throw new DiskException(`Not supported "driver" disk.`);
        }
    }
    build(overrideDisk) {
        this.overrideDisk = overrideDisk;
        return this;
    }
    disk(drive) {
        this.drive = drive;
        return this;
    }
    async exists(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.exists(filepath);
    }
    async missing(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return !await this.driver.missing(filepath);
    }
    async metadata(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.metadata(filepath);
    }
    async size(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.size(filepath);
    }
    async mimeType(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.mimeType(filepath);
    }
    async lastModified(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.lastModified(filepath);
    }
    async get(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return await this.driver.get(filepath);
    }
    async put(filepath, content, options) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        if (isEmpty(content))
            throw new DiskException("The content is required.");
        try {
            await this.driver.put(filepath, content, options);
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
            await this.driver.copy(source, destination, options);
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
            await this.driver.move(source, destination, options);
        }
        catch (error) {
            Logger.setContext("Storage").error("Something went wrong when moving file.").trace(error);
        }
    }
    async delete(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        await this.driver.delete(filepath);
    }
}
