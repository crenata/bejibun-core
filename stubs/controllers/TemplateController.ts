import BaseController from "@bejibun/core/bases/BaseController";

/**
 * Example controller stub defining the five resource actions for the
 * template resource. Each action's body is a placeholder to be filled in.
 */
export default class TemplateController extends BaseController {
    /**
     * Handles the `index` action (listing resources).
     *
     * @param {Bejibun.Request} request - The incoming request.
     * @returns {Promise<Response>} The HTTP response.
     */
    public async index(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    /**
     * Handles the `store` action (creating a resource).
     *
     * @param {Bejibun.Request} request - The incoming request.
     * @returns {Promise<Response>} The HTTP response.
     */
    public async store(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    /**
     * Handles the `show` action (retrieving a single resource).
     *
     * @param {Bejibun.Request} request - The incoming request.
     * @returns {Promise<Response>} The HTTP response.
     */
    public async show(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    /**
     * Handles the `update` action (updating a resource).
     *
     * @param {Bejibun.Request} request - The incoming request.
     * @returns {Promise<Response>} The HTTP response.
     */
    public async update(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    /**
     * Handles the `destroy` action (deleting a resource).
     *
     * @param {Bejibun.Request} request - The incoming request.
     * @returns {Promise<Response>} The HTTP response.
     */
    public async destroy(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }
}
