import { cors } from "../utils/utils";
export default class ResponseBuilder {
    data;
    message;
    status;
    constructor() {
        this.data = null;
        this.message = "Success";
        this.status = 200;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setMessage(message) {
        this.message = message;
        return this;
    }
    setStatus(status) {
        this.status = status;
        return this;
    }
    send() {
        return globalThis.Response.json({
            data: this.data,
            message: this.message,
            status: this.status
        }, {
            headers: {
                ...cors()
            },
            status: this.status
        });
    }
    stream(options = {}) {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: {
                ...cors()
            },
            status: this.status
        });
    }
}
