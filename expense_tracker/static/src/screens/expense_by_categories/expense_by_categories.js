import { asyncComputed, Component, proxy, useProps, onWillStart, signal } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { useModel } from "../../models/model";

import { PersonalExpenseList } from "../expense_list/expense_list";
import { ExpenseTrackerModel } from "../../models/expense_tracker_model";

export class ExpensesByCategory extends Component {
    static template = "expense_tracker.ExpensesByCategory";
    static components = { PersonalExpenseList };
    props = useProps();
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel(this.modelParams);
        this.categories = signal.Array([]);
        this.title = "Expenses by Category";
        this.selectedCategory = signal("all");
        this.state = proxy({ expenses: [] });

        asyncComputed(async () => {
            const res = await this.model.load_category_expenses(this.selectedCategory());
            this.state.expenses = res;
        });

        onWillStart(() => {
            const res = this.model.load_categories(this.props);
            return res.then((res1) => {
                this.categories.set(res1);
            });
        });
    }

    _onCategoryChange(ev) {
        if (ev.currentTarget.value === "all") {
            this.title = "Expenses by Category All";
            this.selectedCategory.set("all");
        } else {
            const categoryId = parseInt(ev.currentTarget.value);
            this.selectedCategory.set(categoryId || null);
        }
    }
}

screensRegistry.add("ExpensesByCategory", ExpensesByCategory);
