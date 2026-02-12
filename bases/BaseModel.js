import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import { Model } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import SoftDeletes from "../facades/SoftDeletes";
import RuntimeException from "../exceptions/RuntimeException";
class BunQueryBuilder extends SoftDeletes {
    // @ts-ignore
    async update(payload) {
        const cloneQuery = this.clone();
        const beforeRows = await cloneQuery;
        if (isEmpty(beforeRows))
            return defineValue(beforeRows);
        await super.update(payload);
        return cloneQuery;
    }
}
// @ts-ignore
export default class BaseModel extends Model {
    static _namespace;
    static tableName;
    static idColumn;
    static createdColumn = "created_at";
    static updatedColumn = "updated_at";
    static deletedColumn = "deleted_at";
    static QueryBuilder = BunQueryBuilder;
    static get namespace() {
        if (isEmpty(this._namespace))
            throw new RuntimeException(`Model namespace not registered for [${this.name}]`);
        return this._namespace;
    }
    $beforeInsert(queryContext) {
        const now = Luxon.DateTime.now();
        if (isNotEmpty(this[this.constructor.createdColumn])) {
            this[this.constructor.createdColumn] = now;
        }
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = now;
        }
    }
    $beforeUpdate(opt, queryContext) {
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = Luxon.DateTime.now();
        }
    }
    static setNamespace(namespace) {
        this._namespace = namespace;
    }
    static query(trxOrKnex) {
        return super.query(trxOrKnex);
    }
    ;
    static withTrashed() {
        return this.query().withTrashed();
    }
    static onlyTrashed() {
        return this.query().onlyTrashed();
    }
    static all() {
        return this.query().select();
    }
    static create(payload) {
        return this.query().insert(payload);
    }
    static find(id) {
        return this.query().findById(id);
    }
    static async findOrFail(id) {
        const result = await this.find(id);
        if (isEmpty(result))
            throw new ModelNotFoundException(`No query results for model [${this.namespace}] [${id}].`);
        return result;
    }
}
