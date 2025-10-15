import { DateTime } from "luxon";
import { QueryBuilder } from "objection";
export default class SoftDeletes extends QueryBuilder {
    hasFilterApplied = false;
    constructor(modelClass) {
        // @ts-ignore
        super(modelClass);
        this.onBuild((builder) => {
            const context = this.context();
            if (!this.hasFilterApplied) {
                const tableName = this.modelClass().tableName;
                if (context.onlyTrashed) {
                    builder.whereNotNull(`${tableName}.${this.modelClass().deletedColumn}`);
                }
                else if (!context.withTrashed) {
                    builder.whereNull(`${tableName}.${this.modelClass().deletedColumn}`);
                }
                this.hasFilterApplied = true;
            }
        });
    }
    withTrashed() {
        return this.context({
            ...this.context(),
            withTrashed: true
        });
    }
    onlyTrashed() {
        return this.context({
            ...this.context(),
            onlyTrashed: true
        });
    }
    delete() {
        return this.update({
            [this.modelClass().deletedColumn]: DateTime.now()
        });
    }
    del() {
        return this.delete();
    }
    forceDelete() {
        return super.delete();
    }
    restore() {
        return this.onlyTrashed().update({
            [this.modelClass().deletedColumn]: null
        });
    }
}
