import { Component, useProps, t, usePlugin } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
    });

    setup() {
        this.sm = usePlugin(ScreenManagerPlugin);
    }

    _onCreateExpense(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
    }

    _onClickExpense(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", id: ev.currentTarget.getAttribute("data-id") },
        });
    }

    _onDeleteExpense(ev) {
        console.log("Deleting Expense Clicked");
    }
}

screensRegistry.add("ExpenseList", PersonalExpenseList);
