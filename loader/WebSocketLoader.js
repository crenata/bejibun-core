export default class WebSocketLoader {
    static controllers = [];
    static add(schedule) {
        WebSocketLoader.controllers.push(schedule);
    }
}
