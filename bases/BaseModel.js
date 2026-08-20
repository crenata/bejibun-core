import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import { Model } from "objection";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import SoftDeletes from "../facades/SoftDeletes";
import RuntimeException from "../exceptions/RuntimeException";
class BunQueryBuilder extends SoftDeletes {
    constructor(modelClass) {
        super(modelClass);
    }
    // @ts-expect-error - BunQueryBuilder's update() intentionally diverges from Objection's chainable QueryBuilder shape for soft-delete semantics.
    async update(payload) {
        const cloneQuery = this.clone();
        const beforeRows = await cloneQuery;
        if (isEmpty(beforeRows))
            return defineValue(beforeRows);
        await super.update(payload);
        return cloneQuery;
    }
}
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
            throw new RuntimeException(`Model namespace not registered for [${this.name}].`);
        return this._namespace;
    }
    $beforeInsert() {
        const now = Luxon.DateTime.now();
        if (isNotEmpty(this[this.constructor.createdColumn])) {
            this[this.constructor.createdColumn] = now;
        }
        if (isNotEmpty(this[this.constructor.updatedColumn])) {
            this[this.constructor.updatedColumn] = now;
        }
    }
    $beforeUpdate() {
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
    static withTrashed(trxOrKnex) {
        return this.query(trxOrKnex).withTrashed();
    }
    static onlyTrashed(trxOrKnex) {
        return this.query(trxOrKnex).onlyTrashed();
    }
    static all(trxOrKnex) {
        return this.query(trxOrKnex).select();
    }
    static create(payload, trxOrKnex) {
        return this.query(trxOrKnex).insert(payload);
    }
    static find(id, trxOrKnex) {
        return this.query(trxOrKnex).findById(id);
    }
    static async findOrFail(id, trxOrKnex) {
        const result = await this.query(trxOrKnex).findById(id);
        if (isEmpty(result))
            throw new ModelNotFoundException(`No query results for model [${this.namespace}] [${id}].`);
        return result;
    }
}
