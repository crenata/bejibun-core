import { QueryBuilder, ModelClass, Model } from "objection";
export default class SoftDeletes<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    private hasFilterApplied;
    constructor(modelClass: ModelClass<M>);
    withTrashed(): this;
    onlyTrashed(): this;
    delete(): QueryBuilder<M, number>;
    del(): QueryBuilder<M, number>;
    forceDelete(): QueryBuilder<M, number>;
    restore(): QueryBuilder<M, number>;
}
