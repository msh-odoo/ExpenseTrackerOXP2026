import { Plugin } from "@expense_tracker/owl";
import { BusPlugin } from "../plugins/bus_plugin";
import { ORMPlugin } from "../plugins/orm_plugin";
import { rpc } from "@expense_tracker/core/rpc";

export class Model extends Plugin {
    /**
     * @param {Object} params
     * @param {Object} options
     */
    setup(params, options) {
        this.rpc = rpc;
        this.bus = plugin(BusPlugin).bus;
        this.orm = plugin(ORMPlugin);
        this.setup(params, options);
    }

    /**
     * @param {SearchParams} searchParams
     */
    async load(/* searchParams */) {}

    /**
     * This function is meant to be overriden by models that want to implement
     * the sample data feature. It should return true iff the last loaded state
     * actually contains data. If not, another load will be done (if the sample
     * feature is enabled) with the orm service substituted by another using the
     * SampleServer, to have sample data to display instead of an empty screen.
     *
     * @returns {boolean}
     */
    hasData() {
        return true;
    }

    /**
     * This function is meant to be overriden by models that want to combine
     * sample data with real groups that exist on the server.
     *
     * @returns {boolean}
     */
    getGroups() {
        return null;
    }

    notify() {
        this.bus.trigger("update");
    }
}
// Model.services = [];

/**
 * @template {typeof Model} T
 * @param {T} ModelClass
 * @param {Object} params
 * @param {Object} [options]
 * @param {Function} [options.beforeFirstLoad]
 * @returns {InstanceType<T>}
 */
export function useModel(ModelClass, params = {}, options = {}) {
    const model = new ModelClass(params);
    return model;
}
