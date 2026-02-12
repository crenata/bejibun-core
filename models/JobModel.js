import { QueryBuilder } from "objection";
import BaseModel from "../bases/BaseModel";
import EpochTimestamps from "../models/EpochTimestamps";
export default class JobModel extends EpochTimestamps(BaseModel) {
    static tableName = "jobs";
    static idColumn = "id";
    static updatedColumn = null;
    static deletedColumn = null;
    static QueryBuilder = QueryBuilder;
    $beforeUpdate(opt, queryContext) {
        // do nothing
    }
}
