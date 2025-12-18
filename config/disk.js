import App from "@bejibun/app";
import DiskDriverEnum from "../enums/DiskDriverEnum";
const config = {
    default: "local",
    disks: {
        local: {
            driver: DiskDriverEnum.Local,
            root: App.Path.storagePath("app")
        },
        public: {
            driver: DiskDriverEnum.Local,
            root: App.Path.storagePath("app/public"),
            url: `${Bun.env.APP_URL}/storage/public`
        }
    }
};
export default config;
