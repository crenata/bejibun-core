import App from "@bejibun/app";
import { readdirSync } from "fs";
import { join, relative, sep } from "path";
import { pathToFileURL } from "url";
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
     * @param {string} filePath - The absolute path to the file.
     * @returns {string} The computed namespace (e.g. `"app/models/User"`).
     */
    computeNamespace(filePath) {
        const rel = relative(App.Path.rootPath(), filePath);
        const withoutExt = rel.replace(/\.[tj]s$/, "");
        const parts = withoutExt.split(sep);
        return parts.join("/");
    }
    /**
     * Recursively collects every `.ts`/`.js` file under the given directory.
     *
     * @param {any} directory - The directory to walk.
     * @returns {Array<string>} The absolute paths of every matching file found. Returns an empty array if the directory can't be read.
     */
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
    /**
     * Walks the given directory, imports every file found, and registers
     * a computed namespace on each file's default export via
     * `setNamespace()` (skipping files with no default export, or whose
     * default export doesn't expose `setNamespace`).
     *
     * @param {string} directory - The directory to load and register namespaces from.
     */
    async load(directory) {
        const files = await this.walk(directory);
        for (const file of files) {
            const fileUrl = pathToFileURL(file).href;
            const module = await import(fileUrl);
            const Class = module.default;
            if (!Class)
                continue;
            const namespace = this.computeNamespace(file);
            if (typeof Class.setNamespace === "function")
                Class.setNamespace(namespace);
        }
    }
}
