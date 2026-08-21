import BaseController from "@bejibun/core/bases/BaseController";

export default class TemplateController extends BaseController {
    public async index(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async store(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async show(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async update(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async destroy(request: Bejibun.Request): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }
}
