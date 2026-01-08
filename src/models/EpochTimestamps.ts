import Luxon from "@bejibun/utils/facades/Luxon";
import {ModelOptions, QueryContext} from "objection";

const EpochTimestamps = (Base: any) => class extends Base {
    declare created_at: bigint;
    declare updated_at: bigint;
    declare deleted_at: bigint | null;

    $beforeInsert(queryContext: QueryContext): void {
        const now = Luxon.DateTime.now().toUnixInteger();
        this.created_at = now;
        this.updated_at = now;
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void {
        this.updated_at = Luxon.DateTime.now().toUnixInteger();
    }
};

export default EpochTimestamps;