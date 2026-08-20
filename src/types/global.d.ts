declare global {
    function config<T = any>(key: string, defaultValue?: T): T;
    function env<T = any>(key: string, defaultValue?: T): T;
}

export {};
