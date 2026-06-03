export default class CorsLoader {
    public static cors: Record<string, any> = {};

    public static set(cors: Record<string, any>): void {
        CorsLoader.cors = cors;
    }
}