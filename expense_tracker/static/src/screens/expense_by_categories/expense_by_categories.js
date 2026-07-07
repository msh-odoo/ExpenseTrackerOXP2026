import { asyncComputed, Component, proxy, props, onWillStart, plugin, providePlugins, signal } from '@expense_tracker/owl';
import { screensRegistry } from '@expense_tracker/registries';
import { useModel } from "../../model/model";

import { PersonalExpenseList } from "../expense_list/expense_list";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class ExpensesByCategory extends Component {
    static template = "expense_tracker.ExpensesByCategory";
    static components = { PersonalExpenseList };
    props = props();

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.categories = signal.Array([]);
        this.selectedCategory = signal('all');
        this.state = proxy({ expenses: [] });
        asyncComputed(async () => {
            debugger;
            const res = await this.model.load_category_expenses(this.selectedCategory());
            this.state.expenses = res;
        });

        onWillStart(async () => {
            const res = await this.model.load_categories(this.props);
            this.categories = res;
        });
    }

    _onCategoryChange(ev) {
        if (ev.currentTarget.value === "all") {
            this.selectedCategory.set("all");
        } else {
            const categoryId = parseInt(ev.currentTarget.value);
            this.selectedCategory.set(categoryId || null);
        }
    }
}

screensRegistry.add("ExpensesByCategory", ExpensesByCategory);
