import App from "@bejibun/app";
import { isEmpty } from "@bejibun/utils";
import { readdirSync } from "fs";
import { join, relative, sep } from "path";
import { pathToFileURL } from "url";
export default class NamespaceBuilder {
    computeNamespace(filePath) {
        const rel = relative(App.Path.rootPath(), filePath);
        const withoutExt = rel.replace(/\.[tj]s$/, "");
        const parts = withoutExt.split(sep);
        return parts.join("/");
    }
    async walk(directory) {
        try {
            const entries = readdirSync(directory, {
                withFileTypes: true
            });
            const files = await Promise.all(entries.map((entry) => {
                const fullPath = join(directory, entry.name);
                return entry.isDirectory()
                    ? this.walk(fullPath)
                    : fullPath.endsWith(".ts") || fullPath.endsWith(".js")
                        ? [fullPath]
                        : [];
            }));
            return files.flat();
        }
        catch {
            return [];
        }
    }
    async load(directory) {
        const files = await this.walk(directory);
        for (const file of files) {
            const fileUrl = pathToFileURL(file).href;
            const module = await import(fileUrl);
            const Class = module.default;
            if (isEmpty(Class))
                continue;
            const namespace = this.computeNamespace(file);
            if (typeof Class.setNamespace === "function")
                Class.setNamespace(namespace);
        }
    }
}
