import type { Knex } from "knex";
import { DateTime } from "luxon";
import { Constructor, Model, ModelOptions, PartialModelObject, QueryBuilder, QueryBuilderType, QueryContext, TransactionOrKnex } from "objection";
import SoftDeletes from "../facades/SoftDeletes";
export interface BaseColumns {
    id: bigint | number;
    created_at: DateTime | string;
    updated_at: DateTime | string;
    deleted_at: DateTime | string | null;
}
declare class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
    update(payload: PartialModelObject<M>): Promise<QueryBuilder<M, R>>;
}
export default class BaseModel extends Model implements BaseColumns {
    static tableName: string;
    static idColumn: string;
    static deletedColumn: string;
    static QueryBuilder: typeof BunQueryBuilder;
    static knex: (knex?: Knex) => Knex;
    id: number | bigint;
    created_at: DateTime | string;
    updated_at: DateTime | string;
    deleted_at: DateTime | string | null;
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
