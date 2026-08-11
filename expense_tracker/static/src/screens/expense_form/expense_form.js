import { Component } from '@odoo/owl';
import { screensRegistry } from "@expense_tracker/registries";

class ExpenseForm extends Component {
    static template = "expense_tracker.ExpenseForm";
    setup() {
        this.title = "Expense";
    }
}

screensRegistry.add("ExpenseForm", ExpenseForm);
