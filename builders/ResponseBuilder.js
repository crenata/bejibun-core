import CorsLoader from "../loader/CorsLoader";
export default class ResponseBuilder {
    data;
    message;
    status;
    custom;
    constructor() {
        this.data = null;
        this.message = "Success";
        this.status = 200;
        this.custom = {};
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
    setCustom(custom) {
        this.custom = custom;
        return this;
    }
    send() {
        return globalThis.Response.json({
            data: this.data,
            message: this.message,
            status: this.status,
            ...this.custom
        }, {
            headers: {
                ...CorsLoader.cors
            },
            status: this.status
        });
    }
    stream(options = {}) {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: {
                ...CorsLoader.cors
            },
            status: this.status
        });
    }
}
