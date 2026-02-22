import App from "@bejibun/app";
import {isEmpty} from "@bejibun/utils";
import {readdirSync} from "fs";
import {join, relative, sep} from "path";
import {pathToFileURL} from "url";

export default class NamespaceBuilder {
    private computeNamespace(filePath: string): string {
        const rel: string = relative(App.Path.rootPath(), filePath);
        const withoutExt: string = rel.replace(/\.[tj]s$/, "");
        const parts: Array<string> = withoutExt.split(sep);

        return parts.join("/");
    }

    private async walk(directory: any): Promise<Array<string>> {
        try {
            const entries: Array<any> = readdirSync(directory, {withFileTypes: true});

            const files: Array<any> = await Promise.all(
                entries.map((entry: any) => {
                    const fullPath: string = join(directory, entry.name);

                    return entry.isDirectory() ?
                        this.walk(fullPath) :
                        (
                            (
                                fullPath.endsWith(".ts") ||
                                fullPath.endsWith(".js")
                            ) ? [fullPath] : []
                        );
                })
            );

            return files.flat();
        } catch {
            return [];
        }
    }

    public async load(directory: string): Promise<void> {
        const files: Array<string> = await this.walk(directory);

        for (const file of files) {
            const fileUrl: string = pathToFileURL(file).href;
            const module = await import(fileUrl);

            const Class = module.default;
            if (isEmpty(Class)) continue;

            const namespace: string = this.computeNamespace(file);

            if (typeof Class.setNamespace === "function") Class.setNamespace(namespace);
        }
    }
}