import type {Knex} from "knex";
import {defineValue, isEmpty} from "@bejibun/utils";
import Str from "@bejibun/utils/facades/Str";
import {DateTime} from "luxon";
import {
    Constructor,
    Model,
    ModelOptions,
    PartialModelObject,
    QueryBuilder,
    QueryBuilderType,
    QueryContext,
    TransactionOrKnex
} from "objection";
import {relative, sep} from "path";
import {fileURLToPath} from "url";
import ModelNotFoundException from "@/exceptions/ModelNotFoundException";
import SoftDeletes from "@/facades/SoftDeletes";

export interface BaseColumns {
    id: bigint | number;
    created_at: DateTime | string;
    updated_at: DateTime | string;
    deleted_at: DateTime | string | null;
}

class BunQueryBuilder<M extends Model, R = M[]> extends SoftDeletes<M, R> {
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
export default class BaseModel extends Model implements BaseColumns {
    public static tableName: string;
    public static idColumn: string;
    public static deletedColumn: string = "deleted_at";

    public static QueryBuilder = BunQueryBuilder;

    public static knex: (knex?: Knex) => Knex;

    declare id: number | bigint;
    declare created_at: DateTime | string;
    declare updated_at: DateTime | string;
    declare deleted_at: DateTime | string | null;

    public static get namespace(): string {
        const filePath = fileURLToPath(import.meta.url);
        const appRoot = process.cwd();
        const rel = relative(appRoot, filePath);
        const withoutExt = rel.replace(/\.[tj]s$/, "");
        const namespaces = withoutExt.split(sep);
        namespaces.pop();
        namespaces.push(this.name);

        return namespaces.map(part => Str.toPascalCase(part)).join("/");
    }

    $beforeInsert(queryContext: QueryContext): void {
        const now = DateTime.now();
        this.created_at = now;
        this.updated_at = now;
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void {
        this.updated_at = DateTime.now();
    }

    public static query<T extends Model>(this: Constructor<T>, trxOrKnex?: TransactionOrKnex): QueryBuilderType<T> {
        return super.query(trxOrKnex);
    };

    public static withTrashed<T extends Model>(this: T): QueryBuilderType<T> {
        return (this as any).query().withTrashed();
    }

    public static onlyTrashed<T extends Model>(this: T): QueryBuilderType<T> {
        return (this as any).query().onlyTrashed();
    }

    public static all<T extends Model>(this: T): QueryBuilderType<T> {
        return (this as any).query().select();
    }

    public static create<T extends Model>(this: T, payload: Record<string, any>): QueryBuilderType<T> {
        return (this as any).query().insert(payload);
    }

    public static find<T extends Model>(this: T, id: bigint | number | string): QueryBuilderType<T> {
        return (this as any).query().findById(id);
    }

    public static async findOrFail<T extends Model>(this: T, id: bigint | number | string): Promise<T> {
        const result = await (this as any).find(id);

        if (isEmpty(result)) throw new ModelNotFoundException(`[ModelNotFoundException]: No query results for model [${(this as any).namespace}] [${id}].`);

        return result;
    }
}