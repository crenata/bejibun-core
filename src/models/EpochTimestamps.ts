import {isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import {ModelOptions, QueryContext} from "objection";

const EpochTimestamps = (Base: any): any => class extends Base {
    $beforeInsert(queryContext: QueryContext): void {
        const now = Luxon.DateTime.now().toUnixInteger();
        if (isNotEmpty((this as any)[(this.constructor as any).createdColumn])) {
            (this as any)[(this.constructor as any).createdColumn] = now;
        }
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = now;
        }
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void {
        this.updated_at = Luxon.DateTime.now().toUnixInteger();
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = Luxon.DateTime.now().toUnixInteger();
        }
    }
};

export default EpochTimestamps;