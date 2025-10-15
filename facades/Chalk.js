import ChalkBuilder from "../builders/ChalkBuilder";
export default class Chalk {
    static setValue(value) {
        return new ChalkBuilder().setValue(value);
    }
}
