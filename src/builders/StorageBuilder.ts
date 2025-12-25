import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import path from "path";
import fs from "fs";
import DiskConfig from "@/config/disk";
import DiskException from "@/exceptions/DiskException";
import DiskDriverEnum from "@/enums/DiskDriverEnum";
import {StorageDisk} from "@/types/storage";

export default class StorageBuilder {
    protected conf: Record<string, any>;
    protected overrideDisk?: StorageDisk;
    protected drive?: string;

    public constructor() {
        const configPath = App.Path.configPath("disk.ts");

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

    private get driver(): any {
        const driver: string | null = defineValue(this.currentDisk?.driver);

        if (isEmpty(driver)) throw new DiskException(`Missing "driver" on disk config.`);

        if (!Enum.setEnums(DiskDriverEnum).hasValue(driver)) throw new DiskException(`Not supported "driver" disk.`);

        switch (driver) {
            case DiskDriverEnum.Local:
                if (isEmpty(this.currentDisk?.root)) throw new DiskException(`Missing "root" for "local" disk configuration.`);
                break;
            default:
                break;
        }

        return driver;
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

        switch (this.driver) {
            case DiskDriverEnum.Local:
                return await Bun.file(path.resolve(this.currentDisk.root, filepath)).exists();
            default:
                return false;
        }
    }

    public async missing(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        return !await this.exists(filepath);
    }

    public async get(filepath: string): Promise<any> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        let data: any = null;

        switch (this.driver) {
            case DiskDriverEnum.Local:
                data = await Bun.file(path.resolve(this.currentDisk.root, filepath)).text();
                break;
            default:
                break;
        }

        return data;
    }

    public async put(filepath: string, content: any): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");
        if (isEmpty(content)) throw new DiskException("The content is required.");

        try {
            switch (this.driver) {
                case DiskDriverEnum.Local:
                    await Bun.write(path.resolve(this.currentDisk.root, filepath), content);
                    break;
                default:
                    break;
            }
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }

    public async delete(filepath: string): Promise<void> {
        if (isEmpty(filepath)) throw new DiskException("The file path is required.");

        switch (this.driver) {
            case DiskDriverEnum.Local:
                await Bun.file(path.resolve(this.currentDisk.root, filepath)).delete();
                break;
            default:
                break;
        }
    }
}