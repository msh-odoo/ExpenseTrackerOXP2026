import { Component, onWillStart, props, proxy, plugin, providePlugins } from '@expense_tracker/owl';
import { useModel } from "../../model/model";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { screensRegistry } from "../registries";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";


export class PersonalExpenseList extends Component {
    static template = 'expense_tracker.PersonalExpenseList';
    props = props();

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({ expenses: [] , selectedCheckboxes: []});
        this.modelName = "personal.expense";
        this.checkboxInteraction = false;
        const options = {
            model: this.modelName,
        };
        if (this.props.expenses) {
            this.state.expenses = this.props.expenses;
        } else {
            onWillStart(async () => {
                const res = await this.model.load_expenses(options);
                debugger;
                this.state.expenses = res;
            });
        }
        providePlugins([BusPlugin]);
        this.busPlugin = plugin(BusPlugin);

        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => this.state.expenses = this.model.load_expenses(options));
        this.busPlugin.bus.addEventListener("delete_record", this._deleteRecord.bind(this));
    }

    get totalAmount() {
        return this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    _onCreateExpense(ev) {
        this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseForm', model: "personal.expense", isNew: true, });
    }

    _onClickExpenseRow(ev) {
        if(!this.checkboxInteraction && this.state.selectedCheckboxes.length === 0) {
            this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseForm', model: "personal.expense", id: ev.currentTarget.getAttribute("data-id") });
        }
        this.checkboxInteraction = false;
    }
    _onCheckboxChange(ev) {
        this.checkboxInteraction = true;
        const recordId =  parseInt(ev.currentTarget.getAttribute("data-id"));
        if (ev.currentTarget.checked) {
            if (!this.state.selectedCheckboxes.includes(recordId)) {
                this.state.selectedCheckboxes.push(recordId);
            }
        } else {
            this.state.selectedCheckboxes = this.state.selectedCheckboxes.filter(id => id !== recordId);
        }
    }
    deleteExpense(ev) {
        const recordIds = [...this.state.selectedCheckboxes];
        this.busPlugin.bus.trigger('delete_record', { model:"personal.expense", ids: recordIds })
    }
    async _deleteRecord(ev) {
        try {
            const { model, ids } = ev.detail;
            await this.model.orm.unlink(model, ids);
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
