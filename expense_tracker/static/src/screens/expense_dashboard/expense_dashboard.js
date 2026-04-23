
import { Component, onWillStart, proxy, providePlugins } from "@expense_tracker/owl";
import { screensRegistry } from "../registries";
import { PersonalExpenseList } from "../expense_list/expense_list";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class Dashboard extends Component {
    static template = "expense_tracker.Dashboard";

    setup() {
        super.setup();
        // TODO: MSH: Adapt following code
        // this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({ expenses: [] });
        providePlugins([BusPlugin]);
        this.busPlugin = plugin(BusPlugin);
        onWillStart(async () => {
            // TODO: MSH: Adapt following code
            // const res = await this.model.load_expenses(this.props);
            // this.state.expenses = res;
        });
        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => this.state.expenses = this.model.load_expenses(nextProps));
    }

    get modelParams() {
        return {};
    }

    _onQuickCreateExpense() {
        this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseForm', model: "personal.expense", isNew: true });
        this.busPlugin.bus.trigger('change_active_menu', 'expenses' );
    }

    _onQuickCreateCategory() {
        this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseCategoryForm', model: "expense.category", isNew: true });
        this.busPlugin.bus.trigger('change_active_menu', 'categories' );
    }
}

Dashboard.components = { PersonalExpenseList }

screensRegistry.add("Dashboard", Dashboard);
