declare global {
    function config<T = any>(key: string, defaultValue?: T): T;
    function env(key: string): string | undefined;
}

export {};