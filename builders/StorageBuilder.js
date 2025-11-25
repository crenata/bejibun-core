import App from "@bejibun/app";
import { isEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import path from "path";
export default class StorageBuilder {
    file;
    directory;
    name;
    constructor() {
        this.name = "";
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
            this.name = `${Luxon.DateTime.now().toUnixInteger()}-${Math.random().toString(36).substring(2, 2 + 16)}`;
        await Bun.write(App.Path.storagePath(`app/public/${this.directory}/${this.name}${path.extname(this.file?.name)}`), this.file);
    }
}
