import { Component, computed, proxy, useProps, t, usePlugin, useEffect, onWillStart } from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { DialogPlugin } from "@expense_tracker/core/dialog/dialog_plugin";
import { DeleteDialog } from "./delete_dialog";
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
        styleclass: t.string().optional(),
    });
    title = useProps.static("title", t.string().optional("Personal Expenses"));
    config = {
        model: ExpenseTrackerModel,
    };
    hasSelection = computed(() => this.state.selectedCheckboxes.length);
    totalAmount = computed(() =>
        this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    );

    setup() {
        this.model = useModel();
        this.sm = usePlugin(ScreenManagerPlugin);
        this.dialogPlugin = usePlugin(DialogPlugin);
        this.state = proxy({ expenses: [], selectedCheckboxes: [] });
        this.modelName = "personal.expense";
        const options = {
            model: this.modelName,
        };
        if (this.props.expenses) {
            useEffect(() => {
                this.state.expenses = this.props.expenses; // subscribe to changes
            });
        } else {
            onWillStart(() => {
                return this.model.load_expenses(options).then((res) => {
                    this.state.expenses = res;
                });
            });
        }
    }

    _onClickExpenseRow(ev) {
        if (!this.checkboxInteraction && this.state.selectedCheckboxes.length === 0) {
            this.sm.changeScreen({
                screen_name: "ExpenseForm",
                props: { model: "personal.expense", id: ev.currentTarget.getAttribute("data-id") },
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

    _onClickExpense(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", id: ev.currentTarget.getAttribute("data-id") },
        });
    }

    _onDeleteExpense(ev) {
        const recordIds = [...this.state.selectedCheckboxes];
        this.dialogRemove = this.dialogPlugin.add(DeleteDialog, {
            confirm: (ev) => {
                const id = ev.currentTarget.getAttribute("id");
                this._deleteRecord(id)
            },
            cancel: () => this.dialogRemove(),
        });
    }

    async _deleteRecord(id) {
        try {
            await this.model.orm.unlink([id]);
            const options = { model: this.modelName };
            const res = await this.model.load_expenses(options);
            this.state.expenses = res;
            this.state.selectedCheckboxes = [];
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    }
}

screensRegistry.add("ExpenseList", PersonalExpenseList);
