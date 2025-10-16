import Cors from "@bejibun/cors";
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
                ...Cors.init
            },
            status: this.status
        });
    }
    stream(options = {}) {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: {
                ...Cors.init
            },
            status: this.status
        });
    }
}
