import type {Timestamp, NullableTimestamp} from "@bejibun/core/bases/BaseModel";
import BaseModel from "@bejibun/core/bases/BaseModel";

export default class TemplateModel extends BaseModel {
    public static tableName: string = "templates";
    public static idColumn: string = "id";

    declare id: bigint;
    declare name: string;
    declare created_at: Timestamp;
    declare updated_at: Timestamp;
    declare deleted_at: NullableTimestamp;
}