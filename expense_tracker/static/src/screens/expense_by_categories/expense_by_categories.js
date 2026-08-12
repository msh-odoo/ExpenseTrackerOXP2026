import { asyncComputed, Component, proxy, useProps, onWillStart, signal } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { useModel } from "../../model/model";

import { PersonalExpenseList } from "../expense_list/expense_list";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { _t } from "@expense_tracker/translate";

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
        this.title = _t("Expenses by Category");
        // this.testNestedSignal = signal.Object({ aa: { bb: "Hello" } });
        // this.testNestedProxy = proxy({ aa: { bb: "Hello" } });
        this.selectedCategory = signal("all");
        this.state = proxy({ expenses: [] });
        // MSH: Note: I was trying to implement abortSignal example but could not do it
        // abortSignal works if component is destroyed while fetch is on flight(it is still not completed) 
        // Actually I have a scenario where I am doing multiple rpc quickly and want to cancel previous one if new request comes
        // I can do it with AbortController and if we want to use our own current mechanism then we can use KeepLast

        // MSH: Note: Explain useScope and  abortSignal or async call cancellation on document itself, as we do not use API which supports abortSignal
        // https://odoo.github.io/owl/documentation/v3/owl/reference/scope.html#cancelling-between-awaits
        // We can use useScope for adding onDestroy callback, where we can do cleanup

        // MSH: Note: Also could not implement real world example of untrack in this application
        // we can explain it on documentation itself: https://odoo.github.io/owl/documentation/v3/owl/reference/effects.html#untrack

        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/computed_values.html#tracking-only-happens-before-the-first-await
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/computed_values.html#async-computed-values
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/computed_values.html#awaiting-the-current-run
        asyncComputed(async () => {
            // const signalObj = this.testNestedSignal();
            // const proxyObj = this.testNestedProxy;
            // debugger;
            // signalObj.aa;
            // proxyObj.aa;
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
            this.title = _t("Expenses by Category All");
            this.selectedCategory.set("all");
        } else {
            const categoryId = parseInt(ev.currentTarget.value);
            this.selectedCategory.set(categoryId || null);
        }
    }
}

screensRegistry.add("ExpensesByCategory", ExpensesByCategory);
