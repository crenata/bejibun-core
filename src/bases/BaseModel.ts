import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import {
    Model,
    ModelClass,
    ModelOptions,
    PartialModelObject,
    QueryBuilder,
    QueryBuilderType,
    QueryContext,
    TransactionOrKnex
} from "objection";
import ModelNotFoundException from "@/exceptions/ModelNotFoundException";
import SoftDeletes from "@/facades/SoftDeletes";
import RuntimeException from "@/exceptions/RuntimeException";

export type Timestamp = typeof Luxon.DateTime | Date | string;
export type NullableTimestamp = Timestamp | null;

class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
    constructor(modelClass?: ModelClass<M>) {
        super(modelClass as ModelClass<M>);
    }

    // @ts-ignore
    async update(payload: PartialModelObject<M>): Promise<QueryBuilder<M, R>> {
        const cloneQuery: QueryBuilder<M, R> = (this as any).clone();

        const beforeRows: any = await cloneQuery;

        if (isEmpty(beforeRows)) return defineValue(beforeRows);

        await super.update(payload);

        return cloneQuery;
    }
}

// @ts-ignore
export default class BaseModel extends Model {
    protected static _namespace: string;

    public static tableName: string;
    public static idColumn: string;
    public static createdColumn: string = "created_at";
    public static updatedColumn: string = "updated_at";
    public static deletedColumn: string = "deleted_at";

    public static QueryBuilder = BunQueryBuilder as unknown as typeof QueryBuilder;

    // @ts-ignore - BunQueryBuilder's update() intentionally diverges from Objection's chainable QueryBuilder shape for soft-delete semantics.
    QueryBuilderType!: BunQueryBuilder<this, this[]>;

    declare id: number | bigint;

    public static get namespace(): string {
        if (isEmpty(this._namespace)) throw new RuntimeException(`Model namespace not registered for [${this.name}].`);

        return this._namespace;
    }

    $beforeInsert(queryContext: QueryContext): void {
        const now = Luxon.DateTime.now() as any;
        if (isNotEmpty((this as any)[(this.constructor as any).createdColumn])) {
            (this as any)[(this.constructor as any).createdColumn] = now;
        }
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = now;
        }
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void {
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = Luxon.DateTime.now() as any;
        }
    }

    public static setNamespace(namespace: string): void {
        this._namespace = namespace;
    }

    public static query<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return super.query(trxOrKnex) as unknown as QueryBuilderType<InstanceType<T>>;
    }

    public static withTrashed<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).withTrashed();
    }

    public static onlyTrashed<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).onlyTrashed();
    }

    public static all<T extends typeof BaseModel>(this: T, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).select();
    }

    public static create<T extends typeof BaseModel>(this: T, payload: Record<string, any>, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).insert(payload);
    }

    public static find<T extends typeof BaseModel>(this: T, id: bigint | number | string, trxOrKnex?: TransactionOrKnex): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).findById(id);
    }

    public static async findOrFail<T extends typeof BaseModel>(this: T, id: bigint | number | string, trxOrKnex?: TransactionOrKnex): Promise<InstanceType<T>> {
        const result: InstanceType<T> = await (this as any).query(trxOrKnex).findById(id);

        if (isEmpty(result)) throw new ModelNotFoundException(`No query results for model [${(this as any).namespace}] [${id}].`);

        return result;
    }
}