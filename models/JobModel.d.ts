declare const JobModel_base: any;
export default class JobModel extends JobModel_base {
    static tableName: string;
    static idColumn: string;
    static updatedColumn: null;
    static deletedColumn: null;
    id: bigint;
    queue: string;
    payload: string;
    attempts: bigint;
    reserved_at: bigint | null;
    available_at: bigint;
    created_at: bigint;
}
export {};
