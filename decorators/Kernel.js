import { isNotEmpty } from "@bejibun/utils";
export default class Kernel {
    static registerDecorator() {
        const paths = [
            {
                absolute: true,
                cwd: __dirname
            }
        ];
        const files = paths
            .map(value => Array.from(new Bun.Glob("**/*").scanSync({
            absolute: value.absolute,
            cwd: value.cwd
        })))
            .flat()
            .filter(value => (/\.(m?js|ts)$/.test(value) &&
            !value.endsWith(".d.ts") &&
            !value.includes("Kernel")));
        for (const file of files) {
            const { default: decorator } = require(file);
            if (typeof decorator !== "function")
                continue;
            if (isNotEmpty(decorator.name))
                globalThis[decorator.name.replace("Decorator", "")] = decorator;
        }
    }
}
