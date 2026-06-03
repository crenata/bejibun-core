import CorsLoader from "@/loader/CorsLoader";

export default class ResponseBuilder {
    protected data?: any;
    protected message: string;
    protected status: number;
    protected custom?: Record<string, any>;

    public constructor() {
        this.data = null;
        this.message = "Success";
        this.status = 200;
        this.custom = {};
    }

    public setData(data?: any): ResponseBuilder {
        this.data = data;

        return this;
    }

    public setMessage(message: string): ResponseBuilder {
        this.message = message;

        return this;
    }

    public setStatus(status: number): ResponseBuilder {
        this.status = status;

        return this;
    }

    public setCustom(custom?: Record<string, any>): ResponseBuilder {
        this.custom = custom;

        return this;
    }

    public send(): globalThis.Response {
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

    public stream(options: ResponseInit = {}): globalThis.Response {
        return new globalThis.Response(Bun.file(this.data), {
            ...options,
            headers: {
                ...CorsLoader.cors
            },
            status: this.status
        });
    }
}