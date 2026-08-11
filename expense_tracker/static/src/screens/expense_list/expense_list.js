import { Component, useProps, t } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
    });
}

screensRegistry.add("ExpenseList", PersonalExpenseList);
