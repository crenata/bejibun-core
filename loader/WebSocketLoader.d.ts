import BaseWebSocket from "../bases/BaseWebSocket";
export default class WebSocketLoader {
    static controllers: Array<BaseWebSocket>;
    static add(schedule: BaseWebSocket): void;
}
