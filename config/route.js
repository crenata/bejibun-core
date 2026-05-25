const config = {
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
                description: "Bejibun Route List",
                contact: {
                    name: "API Support",
                    email: "havea@bejibun.com",
                    url: "mailto:havea@bejibun.com"
                },
                license: {
                    name: "MIT",
                    url: "https://github.com/Bejibun-Framework/bejibun/blob/master/LICENSE"
                }
            },
            servers: [
                {
                    url: Bun.env.APP_URL,
                    description: `${Bun.env.APP_ENV} server`
                }
            ],
            paths: {}
        }
    }
};
export default config;
