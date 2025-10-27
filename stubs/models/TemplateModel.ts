import BaseModel, {BaseColumns} from "@bejibun/core/bases/BaseModel";
import Luxon from "@bejibun/utils/facades/Luxon";

export interface TemplateColumns extends BaseColumns {
    name: string;
}

export default class TemplateModel extends BaseModel implements TemplateColumns {
    public static tableName: string = "templates";
    public static idColumn: string = "id";

    declare id: bigint;
    declare name: string;
    declare created_at: Luxon.DateTime | string;
    declare updated_at: Luxon.DateTime | string;
    declare deleted_at: Luxon.DateTime | string | null;
}