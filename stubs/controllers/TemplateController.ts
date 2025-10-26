import BaseController from "@bejibun/core/bases/BaseController";

export default class TemplateController extends BaseController {
    public async index(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData().send();
    }

    public async store(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData().send();
    }

    public async show(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData().send();
    }

    public async update(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData().send();
    }

    public async destroy(request: Bun.BunRequest): Promise<Response> {
        return super.response.setData().send();
    }
}