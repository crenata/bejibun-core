export type HandlerType = (request: Bun.BunRequest) => Promise<Response>;
export type RouterGroup = Record<string, Record<string, HandlerType>>;
export type ResourceAction = "index" | "store" | "show" | "update" | "destroy";