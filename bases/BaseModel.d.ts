import Luxon from "@bejibun/utils/facades/Luxon";
import { Model, ModelClass, PartialModelObject, QueryBuilder, QueryBuilderType, TransactionOrKnex } from "objection";
import SoftDeletes from "../facades/SoftDeletes";
export type Timestamp = typeof Luxon.DateTime | Date | string;
export type NullableTimestamp = Timestamp | null;
declare class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
    constructor(modelClass?: ModelClass<M>);
    update(payload: PartialModelObject<M>): Promise<QueryBuilder<M, R>>;
}
export default class BaseModel extends Model {
    protected static _namespace: string;
    static tableName: string;
    static idColumn: string;
    static createdColumn: string;
    static updatedColumn: string;
    static deletedColumn: string;
    static QueryBuilder: typeof QueryBuilder;
    QueryBuilderType: BunQueryBuilder<this, this[]>;
    id: number | bigint;
    static get namespace(): string;
    $beforeInsert(): void;
    $beforeUpdate(): void;
    static setNamespace(namespace: string): void;
    static query<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static withTrashed<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static onlyTrashed<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static all<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static create<T extends typeof BaseModel>(this: T, payload: Record<string, any>, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static find<T extends typeof BaseModel>(this: T, id: bigint | number | string, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>>;
    static findOrFail<T extends typeof BaseModel>(this: T, id: bigint | number | string, trxOrKnex?: TransactionOrKnex): Promise<InstanceType<T>>;
}
export {};
