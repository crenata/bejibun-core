import BaseModel from "@/bases/BaseModel";
import EpochTimestamps from "@/models/EpochTimestamps";

export default class JobModel extends EpochTimestamps(BaseModel) {
    public static tableName: string = "jobs";
    public static idColumn: string = "id";
    public static updatedColumn = null;
    public static deletedColumn = null;

    declare id: bigint;
    declare queue: string;
    declare payload: string;
    declare attempts: bigint;
    declare reserved_at: bigint | null;
    declare available_at: bigint;
    declare created_at: bigint;
}