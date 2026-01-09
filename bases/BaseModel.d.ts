import Luxon from "@bejibun/utils/facades/Luxon";
import { Constructor, Model, ModelOptions, PartialModelObject, QueryBuilder, QueryBuilderType, QueryContext, TransactionOrKnex } from "objection";
import SoftDeletes from "../facades/SoftDeletes";
export type Timestamp = typeof Luxon.DateTime | Date | string;
export type NullableTimestamp = Timestamp | null;
declare class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
    update(payload: PartialModelObject<M>): Promise<QueryBuilder<M, R>>;
}
export default class BaseModel extends Model {
    static tableName: string;
    static idColumn: string;
    static createdColumn: string;
    static updatedColumn: string;
    static deletedColumn: string;
    static QueryBuilder: typeof BunQueryBuilder;
    id: number | bigint;
    static get namespace(): string;
    $beforeInsert(queryContext: QueryContext): void;
    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void;
    static query<T extends Model>(this: Constructor<T>, trxOrKnex?: TransactionOrKnex): QueryBuilderType<T>;
    static withTrashed<T extends Model>(this: T): QueryBuilderType<T>;
    static onlyTrashed<T extends Model>(this: T): QueryBuilderType<T>;
    static all<T extends Model>(this: T): QueryBuilderType<T>;
    static create<T extends Model>(this: T, payload: Record<string, any>): QueryBuilderType<T>;
    static find<T extends Model>(this: T, id: bigint | number | string): QueryBuilderType<T>;
    static findOrFail<T extends Model>(this: T, id: bigint | number | string): Promise<T>;
}
export {};
