import type {ApiDocConfig} from "../decorators/ApiDocDecorator";

declare global {
    function ApiDoc(config: ApiDocConfig): Function;
}

export {};