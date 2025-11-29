import App from "@bejibun/app";
import { isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import Str from "@bejibun/utils/facades/Str";
import path from "path";
export default class StorageBuilder {
    file;
    directory;
    name;
    constructor() {
        this.name = "";
        this.directory = "general";
    }
    setFile(file) {
        this.file = file;
        return this;
    }
    setDirectory(directory) {
        this.directory = directory;
        return this;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    async save() {
        if (isEmpty(this.name))
            this.name = Str.random();
        await Bun.write(App.Path.storagePath(`app/public/${this.directory}/${Luxon.DateTime.now().toUnixInteger()}-${this.name}${path.extname(this.file?.name)}`), this.file);
    }
}
