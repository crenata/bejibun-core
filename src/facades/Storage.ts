import {isNotEmpty} from "@bejibun/utils";
import StorageBuilder from "@/builders/StorageBuilder";

export default class Storage {
    public static async save(file: any, directory?: string, name?: string): Promise<any> {
        const builder = new StorageBuilder().setFile(file);

        if (isNotEmpty(directory)) builder.setDirectory(directory as string);
        if (isNotEmpty(name)) builder.setName(name as string);

        return await builder.save();
    }
}