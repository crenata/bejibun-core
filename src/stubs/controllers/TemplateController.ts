import BaseController from "@bejibun/core/bases/BaseController";

export default class TemplateController extends BaseController {
    public async index(request: BejibunRequest): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async store(request: BejibunRequest): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async show(request: BejibunRequest): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async update(request: BejibunRequest): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }

    public async destroy(request: BejibunRequest): Promise<Response> {
        // Your code goes here

        return super.response.setData().send();
    }
}
