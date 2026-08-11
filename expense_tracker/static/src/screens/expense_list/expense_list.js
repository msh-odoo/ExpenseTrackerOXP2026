import { Component, useProps, t } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
    });

    _onCreateExpense(ev) {
        console.log("Create Expense Clicked");
    }

    _onClickExpense(ev) {
        console.log("Clicked on Expense Row");
    }

    _onDeleteExpense(ev) {
        console.log("Deleting Expense Clicked");
    }
}

screensRegistry.add("ExpenseList", PersonalExpenseList);
