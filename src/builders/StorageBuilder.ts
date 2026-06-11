import type {StorageDisk, StorageDriver, StorageOptions} from "@/types/storage";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import fs from "fs";
import StorageLocalBuilder from "@/builders/storage/StorageLocalBuilder";
import StorageS3Builder from "@/builders/storage/StorageS3Builder";
import DiskConfig from "@/config/disk";
import DiskException from "@/exceptions/DiskException";
import DiskDriverEnum from "@/enums/DiskDriverEnum";

export default class StorageBuilder {
    protected conf: Record<string, any>;
    protected overrideDisk?: StorageDisk;
    protected drive?: string;

    public constructor() {
        const configPath: string = App.Path.configPath("disk.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = DiskConfig;

        this.conf = config;
    }

    private get config(): Record<string, any> {
        if (isEmpty(this.conf)) throw new DiskException("There is no config provided.");

        return this.conf;
    }

    private get currentDisk(): any {
        return defineValue(this.overrideDisk, this.config.disks[defineValue(this.drive, this.config.default)]);
    }

    private get driver(): StorageDriver {
        const driver: string | null = defineValue(this.currentDisk?.driver);

        if (isEmpty(driver)) throw new DiskException(`Missing "driver" on disk config.`);

        if (!Enum.setEnums(DiskDriverEnum).hasValue(driver)) throw new DiskException(`Not supported "driver" disk.`);

        switch (driver) {
            case DiskDriverEnum.Local:
                return new StorageLocalBuilder(this.currentDisk);
            case DiskDriverEnum.S3:
                return new StorageS3Builder(this.currentDisk);
            default:
                throw new DiskException(`Not supported "driver" disk.`);
        }
    }

    public build(overrideDisk: StorageDisk): StorageBuilder {
        this.overrideDisk = overrideDisk;

        return this;
    }

    public disk(drive: string): StorageBuilder {
        this.drive = drive;

        return this;
    }

    public async exists(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return await this.driver.exists(filepath);
    }

    public async missing(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return !await this.driver.missing(filepath);
    }

    public async get(filepath: string): Promise<Bun.BunFile | Bun.S3File> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return await this.driver.get(filepath);
    }

    public async put(filepath: string, content: any, options?: StorageOptions): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");
        if (isEmpty(content)) throw new DiskException("The content is required.");

        try {
            await this.driver.put(filepath, content, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }

    public async copy(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new DiskException("The source file path is required.");
        if (isEmpty(destination)) throw new DiskException("The destination file path is required.");

        try {
            await this.driver.copy(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when copying file.").trace(error);
        }
    }

    public async move(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new DiskException("The source file path is required.");
        if (isEmpty(destination)) throw new DiskException("The destination file path is required.");

        try {
            await this.driver.move(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when moving file.").trace(error);
        }
    }

    public async delete(filepath: string): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        await this.driver.delete(filepath);
    }
}