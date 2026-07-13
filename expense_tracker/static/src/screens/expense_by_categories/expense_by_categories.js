import { asyncComputed, Component, proxy, props, onWillStart, signal } from "@expense_tracker/owl";
import { screensRegistry } from "@expense_tracker/registries";
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
        this.selectedCategory = signal("all");
        this.state = proxy({ expenses: [] });
        // MSH: Note: I was trying to implement abortSignal example but could not do it
        // abortSignal works if component is destroyed while fetch is on flight(it is still not completed) 
        // Actually I have a scenario where I am doing multiple rpc quickly and want to cancel previous one if new request comes
        // I can do it with AbortController and if we want to use our own current mechanism then we can use KeepLast

        // MSH: Note: Explain useScope and  abortSignal or async call cancellation on document itself, as we do not use API which supports abortSignal
        // https://odoo.github.io/owl/documentation/v3/owl/reference/scope.html#cancelling-between-awaits
        // We can use useScope for adding onDestroy callback, where we can do cleanup

        // MSH: Note: Also coult not implement real world example of untrack in this application
        // we can explain it on documentation itself: https://odoo.github.io/owl/documentation/v3/owl/reference/effects.html#untrack

        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/computed_values.html#tracking-only-happens-before-the-first-await
        asyncComputed(async () => {
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
