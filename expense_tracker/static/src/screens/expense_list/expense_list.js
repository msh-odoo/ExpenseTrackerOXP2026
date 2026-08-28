import { Component, proxy, onWillStart, useProps, usePlugin, t } from "@odoo/owl";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { screensRegistry } from "@expense_tracker/registries";
import { useModel } from "../../models/model";
import { ExpenseTrackerModel } from "../../models/expense_tracker_model";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
    });
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel();
        this.sm = usePlugin(ScreenManagerPlugin);
        this.state = proxy({ expenses: [], selectedCheckboxes: [] });
        this.modelName = "personal.expense";
        const options = {
            model: this.modelName,
        };
        onWillStart(() => {
            return this.model.load_expenses(options).then((res) => {
                this.state.expenses = res;
            });
        });
    }

    _onClickExpenseRow(ev) {
        if (!this.checkboxInteraction && this.state.selectedCheckboxes.length === 0) {
            this.sm.changeScreen({
                screen_name: "ExpenseForm",
                props: { model: "personal.expense", id: parseInt(ev.currentTarget.getAttribute("data-id")) },
            });
        }
        this.checkboxInteraction = false;
    }

    _onCheckboxChange(ev) {
        this.checkboxInteraction = true;
        const recordId = parseInt(ev.currentTarget.getAttribute("data-id"));
        if (ev.currentTarget.checked) {
            if (!this.state.selectedCheckboxes.includes(recordId)) {
                this.state.selectedCheckboxes.push(recordId);
            }
        } else {
            this.state.selectedCheckboxes = this.state.selectedCheckboxes.filter(
                (id) => id !== recordId,
            );
        }
    }

    _onCreateExpense(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
    }

    _onDeleteExpense(ev) {
        console.log("Deleting Expense Clicked");
    }

}

screensRegistry.add("ExpenseList", PersonalExpenseList);
