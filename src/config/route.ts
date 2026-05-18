const config: Record<string, any> = {
    default: "swagger",

    templates: {
        swagger: {
            openapi: "3.0.0",
            components: {
                securitySchemes: {
                    ApiKeyAuth: {
                        type: "apiKey",
                        in: "header",
                        name: "x-api-key"
                    },
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer"
                    }
                }
            },
            security: [
                {
                    ApiKeyAuth: []
                },
                {
                    BearerAuth: []
                }
            ],
            tags: [
                {
                    name: "Hello",
                    description: "Dummy APIs"
                },
                {
                    name: "Test",
                    description: "Example APIs"
                }
            ],
            info: {
                title: "Route List",
                description: "Bejibun Route List"
            },
            servers: [
                {
                    url: Bun.env.APP_URL
                }
            ],
            paths: {}
        }
    }
};

export default config;