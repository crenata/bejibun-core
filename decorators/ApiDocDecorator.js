import "reflect-metadata";
/** The `reflect-metadata` key `@ApiDoc` config is stored/retrieved under. */
export const ApiDocDecoratorKey = "api:doc";
/**
 * Method decorator that attaches OpenAPI-flavored documentation metadata
 * to a controller method, later read back by `RouterBuilder` (via
 * `Reflect.getMetadata`) when resolving that method as a route handler,
 * and generates the app's route documentation (e.g. Swagger UI).
 *
 * @param {ApiDocConfig} config - The documentation metadata to attach.
 * @returns {any} A method decorator.
 */
const ApiDocDecorator = (config) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(ApiDocDecoratorKey, config, target, propertyKey);
    };
};
export default ApiDocDecorator;
