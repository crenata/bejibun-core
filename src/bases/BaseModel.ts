import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import {
    Model,
    ModelClass,
    PartialModelObject,
    QueryBuilder,
    QueryBuilderType,
    TransactionOrKnex
} from "objection";
import ModelNotFoundException from "@/exceptions/ModelNotFoundException";
import SoftDeletes from "@/facades/SoftDeletes";
import RuntimeException from "@/exceptions/RuntimeException";

export type Timestamp = typeof Luxon.DateTime | Date | string;
export type NullableTimestamp = Timestamp | null;

/**
 * Internal query builder used by `BaseModel`. Extends the soft-deletes
 * builder so every model gets soft-delete-aware querying, and overrides
 * `update()` to snapshot the affected rows *before* the update runs
 * (Objection's own `update()` doesn't return the updated rows by default).
 */
class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
    constructor(modelClass?: ModelClass<M>) {
        super(modelClass as ModelClass<M>);
    }

    /**
     * Updates matching rows, returning the query for the rows that
     * matched *before* the update was applied (or `undefined` if none
     * matched, so callers can short-circuit).
     *
     * @param payload - The partial column values to update.
     * @returns The pre-update query builder for the affected rows.
     */
    // @ts-expect-error - BunQueryBuilder's update() intentionally diverges from Objection's chainable QueryBuilder shape for soft-delete semantics.
    async update(payload: PartialModelObject<M>): Promise<QueryBuilder<M, R>> {
        const cloneQuery: QueryBuilder<M, R> = (this as any).clone();

        const beforeRows: any = await cloneQuery;

        if (isEmpty(beforeRows)) return defineValue(beforeRows);

        await super.update(payload);

        return cloneQuery;
    }
}

/**
 * Base class every Bejibun Objection model extends. Adds automatic
 * `created_at`/`updated_at` timestamp handling, soft-delete-aware query
 * helpers (`withTrashed`, `onlyTrashed`), Laravel-style static query
 * shortcuts (`all`, `create`, `find`, `findOrFail`), and namespace
 * registration for resolving models by name.
 */
export default class BaseModel extends Model {
    /** The registered namespace/identifier this model is resolved under. Set via `setNamespace()`. */
    protected static _namespace: string;

    /** The database table this model maps to. */
    public static tableName: string;

    /** The primary key column name. */
    public static idColumn: string;

    /** The column that stores the creation timestamp. */
    public static createdColumn: string = "created_at";

    /** The column that stores the last-updated timestamp. */
    public static updatedColumn: string = "updated_at";

    /** The column that stores the soft-delete timestamp. */
    public static deletedColumn: string = "deleted_at";

    /** The soft-delete-aware query builder class used for all queries on this model. */
    public static QueryBuilder = BunQueryBuilder as unknown as typeof QueryBuilder;

    // @ts-expect-error - BunQueryBuilder's update() intentionally diverges from Objection's chainable QueryBuilder shape for soft-delete semantics.
    declare QueryBuilderType: BunQueryBuilder<this, this[]>;

    declare id: number | bigint;

    /**
     * The model's registered namespace.
     *
     * @throws {RuntimeException} If the namespace hasn't been registered via `setNamespace()`.
     */
    public static get namespace(): string {
        if (isEmpty(this._namespace))
            throw new RuntimeException(`Model namespace not registered for [${this.name}].`);

        return this._namespace;
    }

    /**
     * Objection lifecycle hook: stamps `createdColumn`/`updatedColumn`
     * with the current time before an insert, if those columns already
     * have a value set on the instance.
     */
    $beforeInsert(): void {
        const now = Luxon.DateTime.now() as any;
        if (isNotEmpty((this as any)[(this.constructor as any).createdColumn])) {
            (this as any)[(this.constructor as any).createdColumn] = now;
        }
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = now;
        }
    }

    /**
     * Objection lifecycle hook: stamps `updatedColumn` with the current
     * time before an update, if that column already has a value set on
     * the instance.
     */
    $beforeUpdate(): void {
        if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
            (this as any)[(this.constructor as any).updatedColumn] = Luxon.DateTime.now() as any;
        }
    }

    /**
     * Registers the namespace/identifier this model is resolved under.
     * Typically called once by the framework's namespace loader.
     *
     * @param namespace - The namespace to register.
     */
    public static setNamespace(namespace: string): void {
        this._namespace = namespace;
    }

    /**
     * Starts a new query for this model, using the soft-delete-aware
     * `BunQueryBuilder`.
     *
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder.
     */
    public static query<T extends typeof BaseModel>(
        this: T,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return super.query(trxOrKnex) as unknown as QueryBuilderType<InstanceType<T>>;
    }

    /**
     * Starts a query that includes soft-deleted rows.
     *
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder, including trashed rows.
     */
    public static withTrashed<T extends typeof BaseModel>(
        this: T,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).withTrashed();
    }

    /**
     * Starts a query restricted to only soft-deleted rows.
     *
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder, restricted to trashed rows.
     */
    public static onlyTrashed<T extends typeof BaseModel>(
        this: T,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).onlyTrashed();
    }

    /**
     * Retrieves every row for this model - shorthand for `query().select()`.
     *
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder resolving to all rows.
     */
    public static all<T extends typeof BaseModel>(
        this: T,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).select();
    }

    /**
     * Inserts a new row - shorthand for `query().insert(payload)`.
     *
     * @param payload - The column values to insert.
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder resolving to the inserted row.
     */
    public static create<T extends typeof BaseModel>(
        this: T,
        payload: Record<string, any>,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).insert(payload);
    }

    /**
     * Finds a row by primary key - shorthand for `query().findById(id)`.
     * Resolves to `undefined` if no matching row exists.
     *
     * @param id - The primary key value to look up.
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The query builder resolving to the matching row, if any.
     */
    public static find<T extends typeof BaseModel>(
        this: T,
        id: bigint | number | string,
        trxOrKnex?: TransactionOrKnex
    ): QueryBuilderType<InstanceType<T>> {
        return (this as any).query(trxOrKnex).findById(id);
    }

    /**
     * Finds a row by primary key, throwing if it doesn't exist - mirrors
     * Laravel's `Model::findOrFail()`.
     *
     * @param id - The primary key value to look up.
     * @param trxOrKnex - Optional transaction or Knex instance to run the query on.
     * @returns The matching row.
     * @throws {ModelNotFoundException} If no row matches the given id.
     */
    public static async findOrFail<T extends typeof BaseModel>(
        this: T,
        id: bigint | number | string,
        trxOrKnex?: TransactionOrKnex
    ): Promise<InstanceType<T>> {
        const result: InstanceType<T> = await (this as any).query(trxOrKnex).findById(id);

        if (isEmpty(result))
            throw new ModelNotFoundException(
                `No query results for model [${(this as any).namespace}] [${id}].`
            );

        return result;
    }
}
