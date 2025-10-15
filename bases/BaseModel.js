import { DateTime } from "luxon";
import { Model } from "objection";
import { relative, sep } from "path";
import { fileURLToPath } from "url";
import ModelNotFoundException from "../exceptions/ModelNotFoundException";
import SoftDeletes from "../facades/SoftDeletes";
import Str from "../facades/Str";
import { defineValue, isEmpty } from "../utils/utils";
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
    static tableName;
    static idColumn;
    static deletedColumn = "deleted_at";
    static QueryBuilder = BunQueryBuilder;
    static get namespace() {
        const filePath = fileURLToPath(import.meta.url);
        const appRoot = process.cwd();
        const rel = relative(appRoot, filePath);
        const withoutExt = rel.replace(/\.[tj]s$/, "");
        const namespaces = withoutExt.split(sep);
        namespaces.pop();
        namespaces.push(this.name);
        return namespaces.map(part => Str.toPascalCase(part)).join("/");
    }
    $beforeInsert(queryContext) {
        const now = DateTime.now();
        this.created_at = now;
        this.updated_at = now;
    }
    $beforeUpdate(opt, queryContext) {
        this.updated_at = DateTime.now();
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
            throw new ModelNotFoundException(`[ModelNotFoundException]: No query results for model [${this.namespace}] [${id}].`);
        return result;
    }
}
