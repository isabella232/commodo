import StorageCacheEntry from "./StorageCacheEntry";
import getPrimaryKey from "./getPrimaryKey";

function getPoolItemId(model, data) {
    const primaryKey = getPrimaryKey(model);
    const output = { namespace: model.getStorageName(), id: [] };

    for (let i = 0; i < primaryKey.fields.length; i++) {
        let field = primaryKey.fields[i];
        let partOfId = data ? data[field.name] : model[field.name];
        if (partOfId) {
            partOfId && output.id.push(partOfId);
        }
    }

    output.id.join(":");
    return output;
}

class StorageCache {
    pool: {};
    constructor() {
        this.pool = {};
    }

    getPool() {
        return this.pool;
    }

    add(model) {
        const { namespace, id } = getPoolItemId(model);
        if (!this.getPool()[namespace]) {
            this.getPool()[namespace] = {};
        }

        this.getPool()[namespace][id] = new StorageCacheEntry(model);
        return this;
    }

    remove(model) {
        const { namespace, id } = getPoolItemId(model);
        if (!this.getPool()[namespace]) {
            return this;
        }

        delete this.getPool()[namespace][id];
        return this;
    }

    get(model, data: any = null) {
        const { namespace, id } = getPoolItemId(model, data);
        if (!namespace || id.length === 0) {
            return;
        }

        if (!this.getPool()[namespace]) {
            return;
        }

        const poolEntry: StorageCacheEntry = this.getPool()[namespace][id];
        if (poolEntry) {
            return poolEntry.getModel();
        }
    }

    flush(): this {
        this.pool = {};
        return this;
    }
}

export default StorageCache;