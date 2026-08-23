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
    private computeNamespace;
    /**
     * Recursively collects every `.ts`/`.js` file under the given directory.
     *
     * @param directory - The directory to walk.
     * @returns The absolute paths of every matching file found. Returns an empty array if the directory can't be read.
     */
    private walk;
    /**
     * Walks the given directory, imports every file found, and registers
     * a computed namespace on each file's default export via
     * `setNamespace()` (skipping files with no default export, or whose
     * default export doesn't expose `setNamespace`).
     *
     * @param directory - The directory to load and register namespaces from.
     */
    load(directory: string): Promise<void>;
}
