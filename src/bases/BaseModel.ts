import App from "@bejibun/app";
import {defineValue, isEmpty, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import Str from "@bejibun/utils/facades/Str";
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

export type Timestamp = typeof Luxon.DateTime | Date | string;
export type NullableTimestamp = Timestamp | null;

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
export default class BaseModel extends Model {
    public static tableName: string;
    public static idColumn: string;
    public static createdColumn: string = "created_at";
    public static updatedColumn: string = "updated_at";
    public static deletedColumn: string = "deleted_at";

    public static QueryBuilder = BunQueryBuilder;

    declare id: number | bigint;

    public static get namespace(): string {
        const filePath: string = fileURLToPath(import.meta.url);
        const rel: string = relative(App.Path.rootPath(), filePath);
        const withoutExt: string = rel.replace(/\.[tj]s$/, "");
        const namespaces: Array<string> = withoutExt.split(sep);
        namespaces.pop();
        namespaces.push(this.name);

        return namespaces.map((part: string) => Str.toPascalCase(part)).join("/");
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
        const result: T = await (this as any).find(id);

        if (isEmpty(result)) throw new ModelNotFoundException(`No query results for model [${(this as any).namespace}] [${id}].`);

        return result;
    }
}