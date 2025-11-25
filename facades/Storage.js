import { isNotEmpty } from "@bejibun/utils";
import StorageBuilder from "../builders/StorageBuilder";
export default class Storage {
    static async save(file, directory, name) {
        const builder = new StorageBuilder().setFile(file);
        if (isNotEmpty(directory))
            builder.setDirectory(directory);
        if (isNotEmpty(name))
            builder.setName(name);
        return await builder.save();
    }
}
