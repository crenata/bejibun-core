import { isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
const EpochTimestamps = (Base) => class extends Base {
    $beforeInsert(queryContext) {
        const now = Luxon.DateTime.now().toUnixInteger();
        if (isNotEmpty(this[this.constructor.createdColumn])) {
            this[this.constructor.createdColumn] = now;
        }
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = now;
        }
    }
    $beforeUpdate(opt, queryContext) {
        this.updated_at = Luxon.DateTime.now().toUnixInteger();
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = Luxon.DateTime.now().toUnixInteger();
        }
    }
};
export default EpochTimestamps;
