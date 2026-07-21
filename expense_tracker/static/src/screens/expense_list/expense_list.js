import {
    Component,
    onWillStart,
    useProps,
    computed,
    proxy,
    providePlugins,
    usePlugin,
    t,
    useEffect,
} from "@odoo/owl";
import { useModel } from "../../model/model";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ORMPlugin } from "@expense_tracker/plugins/orm_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { screensRegistry } from "@expense_tracker/registries";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class PersonalExpenseList extends Component {
    static template = "expense_tracker.PersonalExpenseList";
    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/props.html
    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/types_validation.html
    props = useProps({
        expenses: t.array().optional(),
        ignoreCreate: t.boolean().optional(),
        class: t.string().optional(),
    });
    hasSelection = computed(() => this.state.selectedCheckboxes.length);
    totalAmount = computed(() =>
        this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    );

    setup() {
        providePlugins([BusPlugin, ScreenManagerPlugin, ORMPlugin]);
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.busPlugin = usePlugin(BusPlugin);
        this.sm = usePlugin(ScreenManagerPlugin);
        // TODO: MSH: Convert it to signal.Array for both values, we will use selectedCheckboxes in computed
        // const expenses = signal.Array([]);
        this.state = proxy({ expenses: [], selectedCheckboxes: []});
        this.modelName = "personal.expense";
        this.checkboxInteraction = false;
        const options = {
            model: this.modelName,
        };
        if (this.props.expenses) {
            useEffect(() => {
                // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/effects.html
                this.state.expenses = this.props.expenses; // subscribe to changes
            });
        } else {
            onWillStart(async () => {
                const res = await this.model.load_expenses(options);
                this.state.expenses = res;
            });
        }

        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => this.state.expenses = this.model.load_expenses(options));
        this.busPlugin.bus.addEventListener("delete_record", this._deleteRecord.bind(this));
    }

    onCreateExpense(ev) {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
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
    deleteExpense(ev) {
        const recordIds = [...this.state.selectedCheckboxes];
        this.busPlugin.bus.trigger("delete_record", { model: "personal.expense", ids: recordIds });
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
