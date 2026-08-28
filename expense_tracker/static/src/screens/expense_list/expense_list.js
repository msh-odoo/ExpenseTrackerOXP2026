import { Component, useProps, usePlugin, t } from "@odoo/owl";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { screensRegistry } from "@expense_tracker/registries";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
    });

    setup() {
        this.sm = usePlugin(ScreenManagerPlugin);
    }

}

screensRegistry.add("ExpenseList", PersonalExpenseList);
