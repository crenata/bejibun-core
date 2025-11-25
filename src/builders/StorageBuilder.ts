import App from "@bejibun/app";
import {isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";

export default class StorageBuilder {
    protected file: any;
    protected directory?: string;
    protected name?: string;

    public constructor() {
        this.name = "";
    }

    public setFile(file: any): StorageBuilder {
        this.file = file;

        return this;
    }

    public setDirectory(directory: string): StorageBuilder {
        this.directory = directory;

        return this;
    }

    public setName(name: string): StorageBuilder {
        this.name = name;

        return this;
    }

    public async save(): Promise<any> {
        if (isEmpty(this.name)) this.name = `${Luxon.DateTime.now().toUnixInteger()}-${Math.random().toString(36).substring(2, 2 + 16)}`;

        await Bun.write(App.Path.storagePath(`app/public/${this.directory}/${this.name}${path.extname(this.file?.name)}`), this.file);
    }
}