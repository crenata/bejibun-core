import App from "@bejibun/app";
import {isEmpty} from "@bejibun/utils";
import {readdirSync} from "fs";
import {join, relative, sep} from "path";
import {pathToFileURL} from "url";

/**
 * Recursively scans a directory for `.ts`/`.js` files, dynamically imports
 * each one, and calls `setNamespace()` on its default export (if present)
 * with a namespace string derived from the file's path relative to the
 * project root. Used at boot time to auto-register namespaces for models,
 * jobs, and other classes that extend a `Base*` class exposing
 * `setNamespace()`.
 */
export default class NamespaceBuilder {
    /**
     * Derives a namespace string from a file's path, relative to the
     * project root, with the file extension stripped and path separators
     * normalized to forward slashes.
     *
     * @param filePath - The absolute path to the file.
     * @returns The computed namespace (e.g. `"app/models/User"`).
     */
    private computeNamespace(filePath: string): string {
        const rel: string = relative(App.Path.rootPath(), filePath);
        const withoutExt: string = rel.replace(/\.[tj]s$/, "");
        const parts: Array<string> = withoutExt.split(sep);

        return parts.join("/");
    }

    /**
     * Recursively collects every `.ts`/`.js` file under the given directory.
     *
     * @param directory - The directory to walk.
     * @returns The absolute paths of every matching file found. Returns an empty array if the directory can't be read.
     */
    private async walk(directory: any): Promise<Array<string>> {
        try {
            const entries: Array<any> = readdirSync(directory, {
                withFileTypes: true
            });

            const files: Array<any> = await Promise.all(
                entries.map((entry: any) => {
                    const fullPath: string = join(directory, entry.name);

                    return entry.isDirectory()
                        ? this.walk(fullPath)
                        : fullPath.endsWith(".ts") || fullPath.endsWith(".js")
                          ? [fullPath]
                          : [];
                })
            );

            return files.flat();
        } catch {
            return [];
        }
    }

    /**
     * Walks the given directory, imports every file found, and registers
     * a computed namespace on each file's default export via
     * `setNamespace()` (skipping files with no default export, or whose
     * default export doesn't expose `setNamespace`).
     *
     * @param directory - The directory to load and register namespaces from.
     */
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
