import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import path from "path";
import fs from "fs";
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
                if (isEmpty(this.currentDisk?.root))
                    throw new DiskException(`Missing "root" for "local" disk configuration.`);
                break;
            case DiskDriverEnum.S3:
                if (isEmpty(this.currentDisk?.endpoint))
                    throw new DiskException(`Missing "endpoint" for "s3" disk configuration.`);
                if (isEmpty(this.currentDisk?.access_key_id))
                    throw new DiskException(`Missing "access_key_id" for "s3" disk configuration.`);
                if (isEmpty(this.currentDisk?.secret_access_key))
                    throw new DiskException(`Missing "secret_access_key" for "s3" disk configuration.`);
                break;
            default:
                break;
        }
        return driver;
    }
    get s3() {
        if (this.driver !== DiskDriverEnum.S3)
            throw new DiskException(`Driver is not "s3".`);
        return new Bun.S3Client({
            endpoint: this.currentDisk?.endpoint,
            region: this.currentDisk?.region,
            bucket: this.currentDisk?.bucket,
            accessKeyId: this.currentDisk?.access_key_id,
            secretAccessKey: this.currentDisk?.secret_access_key
        });
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
        switch (this.driver) {
            case DiskDriverEnum.Local:
                return await Bun.file(path.resolve(this.currentDisk.root, filepath)).exists();
            case DiskDriverEnum.S3:
                return await this.s3.file(filepath).exists();
            default:
                return false;
        }
    }
    async missing(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        return !await this.exists(filepath);
    }
    async get(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        let data = null;
        switch (this.driver) {
            case DiskDriverEnum.Local:
                data = await Bun.file(path.resolve(this.currentDisk.root, filepath)).text();
                break;
            case DiskDriverEnum.S3:
                data = await this.s3.file(filepath).text();
                break;
            default:
                break;
        }
        return data;
    }
    async put(filepath, content, options) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        if (isEmpty(content))
            throw new DiskException("The content is required.");
        try {
            switch (this.driver) {
                case DiskDriverEnum.Local:
                    await Bun.write(path.resolve(this.currentDisk.root, filepath), content, options);
                    break;
                case DiskDriverEnum.S3:
                    await this.s3.write(filepath, content, options);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }
    async delete(filepath) {
        if (isEmpty(filepath))
            throw new DiskException("The file path is required.");
        switch (this.driver) {
            case DiskDriverEnum.Local:
                await Bun.file(path.resolve(this.currentDisk.root, filepath)).delete();
                break;
            case DiskDriverEnum.S3:
                await this.s3.file(filepath).delete();
                break;
            default:
                break;
        }
    }
}
