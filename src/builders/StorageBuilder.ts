import App from "@bejibun/app";
import {isEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import Str from "@bejibun/utils/facades/Str";
import path from "path";

export default class StorageBuilder {
    protected file: any;
    protected directory?: string;
    protected name?: string;

    public constructor() {
        this.name = "";
        this.directory = "general";
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
        if (isEmpty(this.name)) this.name = Str.random();

        await Bun.write(App.Path.storagePath(`app/public/${this.directory}/${Luxon.DateTime.now().toUnixInteger()}-${this.name}${path.extname(this.file?.name)}`), this.file);
    }
}