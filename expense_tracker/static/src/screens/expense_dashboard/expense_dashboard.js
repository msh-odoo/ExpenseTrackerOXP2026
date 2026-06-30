
import { Component, onWillStart, proxy, plugin, providePlugins } from "@expense_tracker/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { PersonalExpenseList } from "../expense_list/expense_list";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ORMPlugin } from "@expense_tracker/plugins/orm_plugin";
import { ExpenseTrackerModelPlugin } from "../../model/expense_tracker_model";
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Dashboard extends Component {
    static template = "expense_tracker.Dashboard";
    busPlugin = plugin(BusPlugin);
    sm = plugin(ScreenManagerPlugin);

    setup() {
        super.setup();
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({ expenses: [] });
        // providePlugins([BusPlugin, ORMPlugin]); // Not needed, we passed plugins to App so ORM and Bus will be available to whole App and it's decendants
        
        onWillStart(async () => {
            const res = await this.model.load_expenses(this.props);
            this.state.expenses = res;
        });
        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => this.state.expenses = this.model.load_expenses(nextProps));
    }

    get modelParams() {
        return {};
    }

    _onQuickCreateExpense() {
        this.sm.changeScreen({ screen_name: 'ExpenseForm', props: { model: "personal.expense", isNew: true }});
        // this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseForm', model: "personal.expense", isNew: true });
        this.busPlugin.bus.trigger('change_active_menu', 'expenses' );
    }

    _onQuickCreateCategory() {
        this.sm.changeScreen({ screen_name: 'ExpenseCategoryForm', props: { model: "expense.category", isNew: true }});
        // this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'ExpenseCategoryForm', model: "expense.category", isNew: true });
        this.busPlugin.bus.trigger('change_active_menu', 'categories' );
    }
}

Dashboard.components = { PersonalExpenseList }

screensRegistry.add("Dashboard", Dashboard);
