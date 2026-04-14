import "reflect-metadata";
export const ApiDocDecoratorKey = "api:doc";
const ApiDocDecorator = (config) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(ApiDocDecoratorKey, config, target, propertyKey);
    };
};
export default ApiDocDecorator;
