import {DateTime} from "luxon";
import {QueryBuilder, ModelClass, QueryContext, Model} from "objection";

interface SoftDeleteQueryContext extends QueryContext {
    withTrashed?: boolean;
    onlyTrashed?: boolean;
}

export default class SoftDeletes<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    private hasFilterApplied = false;

    constructor(modelClass: ModelClass<M>) {
        // @ts-ignore
        super(modelClass);

        this.onBuild((builder: QueryBuilder<M, R>) => {
            const context = this.context() as SoftDeleteQueryContext;

            if (!this.hasFilterApplied) {
                const tableName = this.modelClass().tableName;

                if (context.onlyTrashed) {
                    builder.whereNotNull(`${tableName}.${(this.modelClass() as any).deletedColumn}`);
                } else if (!context.withTrashed) {
                    builder.whereNull(`${tableName}.${(this.modelClass() as any).deletedColumn}`);
                }

                this.hasFilterApplied = true;
            }
        });
    }

    withTrashed(): this {
        return (this as any).context({
            ...(this as any).context(),
            withTrashed: true
        });
    }

    onlyTrashed(): this {
        return (this as any).context({
            ...(this as any).context(),
            onlyTrashed: true
        });
    }

    delete(): QueryBuilder<M, number> {
        return this.update({
            [(this.modelClass() as any).deletedColumn]: DateTime.now()
        } as any);
    }

    del(): QueryBuilder<M, number> {
        return this.delete();
    }

    forceDelete(): QueryBuilder<M, number> {
        return super.delete();
    }

    restore(): QueryBuilder<M, number> {
        return this.onlyTrashed().update({
            [(this.modelClass() as any).deletedColumn]: null
        } as any);
    }
}