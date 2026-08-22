import type {ApiDocConfig} from "../decorators/ApiDocDecorator";
import type {BejibunRequest} from "../types/request";
import {SchemaTypes, VineValidator} from "@vinejs/vine";

declare global {
    /**
     * Retrieves a configuration value by key.
     *
     * @param key - The dot-notated (or plain) key identifying the config value to retrieve.
     * @param defaultValue - The value to return if the config key is not found.
     * @returns The configuration value associated with the key, or defaultValue if not found.
     */
    function config<T = any>(key: string, defaultValue?: T): T;

    /**
     * Retrieves an environment variable value by key.
     *
     * @param key - The name of the environment variable to retrieve.
     * @param defaultValue - The value to return if the environment variable is not set.
     * @returns The environment variable value, or defaultValue if not set.
     */
    function env<T = any>(key: string, defaultValue?: T): T;

    function ApiDoc(config: ApiDocConfig): any;

    namespace Bejibun {
        type Request<Path extends string = string> = BejibunRequest<Path>;

        type Validator = VineValidator<SchemaTypes, Record<string, any> | undefined>;
    }
}

export {};
