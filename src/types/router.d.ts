import type {BunRequest} from "bun";

export type HandlerType = (request: BunRequest) => Promise<Response>;
export type RouterGroup = Record<string, Record<string, HandlerType>>;
export type ResourceAction = "index" | "store" | "show" | "update" | "destroy";