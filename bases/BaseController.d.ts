import Response from "../facades/Response";
/**
 * Base class every Bejibun controller extends. Provides shared conveniences
 * (a `Response` facade accessor and payload validation) so individual
 * controllers don't need to import them directly.
 */
export default class BaseController {
    /**
     * Convenient accessor for the `Response` facade, so controllers can
     * write `this.response.setData(...)` instead of importing the facade.
     */
    get response(): typeof Response;
}
