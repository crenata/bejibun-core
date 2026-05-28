import BaseWebSocket from "@/bases/BaseWebSocket";

export default class WebSocketLoader {
    public static controllers: Array<BaseWebSocket> = [];

    public static add(schedule: BaseWebSocket): void {
        WebSocketLoader.controllers.push(schedule);
    }
}