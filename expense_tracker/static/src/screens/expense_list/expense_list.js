import { Component, useProps } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps();
}

screensRegistry.add("ExpenseList", PersonalExpenseList);
