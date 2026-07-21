import { Component, proxy, useProps, onWillStart, usePlugin, providePlugins } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { useModel } from "../../model/model";

import { BusPlugin } from "../../plugins/bus_plugin";
import { ScreenManagerPlugin } from "../../plugins/screen_manager_plugin";
import { ORMPlugin } from "../../plugins/orm_plugin";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class ExpenseCategoriesList extends Component {
    static template = "expense_tracker.CategoriesList";
    props = useProps();

    setup() {
        providePlugins([BusPlugin, ScreenManagerPlugin, ORMPlugin]);
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/proxies.html
        this.state = proxy({ categories: [], selectedCategories: [] });
        this.modelName = "expense.category";
        this.checkboxInteraction = false;
        // providePlugins([BusPlugin]);
        this.busPlugin = usePlugin(BusPlugin);
        this.sm = usePlugin(ScreenManagerPlugin);

        onWillStart(async () => {
            const res = await this.model.load_categories(this.props);
            this.state.categories = res;
        });
        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => this.state.categories = this.model.load_categories(nextProps));
    }

    _onClickAddCategory(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseCategoryForm",
            props: { model: "expense.category", isNew: true },
        });
    }

    _onClickCategory(ev) {
        if (!this.checkboxInteraction && this.state.selectedCategories.length === 0) {
            this.sm.changeScreen({
                screen_name: "ExpenseCategoryForm",
                props: { model: "expense.category", id: ev.currentTarget.getAttribute("data-id") },
            });
        }
        this.checkboxInteraction = false;
    }

    _onCategorySelection(ev) {
        this.checkboxInteraction = true;
        const recordId = parseInt(ev.currentTarget.getAttribute("data-id"));
        if (ev.currentTarget.checked) {
            if (!this.state.selectedCategories.includes(recordId)) {
                this.state.selectedCategories.push(recordId);
            }
        } else {
            this.state.selectedCategories = this.state.selectedCategories.filter(
                (id) => id !== recordId,
            );
        }
    }
    deleteCategory(ev) {
        const recordIds = [...this.state.selectedCategories];
        this._deleteCategory({ detail: { model: "expense.category", ids: recordIds } });
    }

    async _deleteCategory(ev) {
        try {
            const { model, ids } = ev.detail;
            await this.model.orm.unlink(model, ids);
            const options = { model: this.modelName };
            const res = await this.model.load_categories(options);
            this.state.categories = res;
            this.state.selectedCategories = [];
        } catch (error) {
            console.error("Error deleting categories:", error);
        }
    }
}

screensRegistry.add("CategoriesList", ExpenseCategoriesList);
