import BaseModel from "@/bases/BaseModel";

export interface JobColumns {
    id: bigint;
    queue: string;
    payload: string;
    attempts: bigint;
    reserved_at: bigint | null;
    available_at: bigint;
    created_at: bigint;
}

export default class JobModel extends BaseModel implements JobColumns {
    public static tableName: string = "jobs";
    public static idColumn: string = "id";

    declare id: bigint;
    declare queue: string;
    declare payload: string;
    declare attempts: bigint;
    declare reserved_at: bigint | null;
    declare available_at: bigint;
    declare created_at: bigint;
}