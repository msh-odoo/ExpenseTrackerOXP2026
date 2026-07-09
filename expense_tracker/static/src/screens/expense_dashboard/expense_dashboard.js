
import { Component, effect, ErrorBoundary, onWillStart, proxy, plugin, providePlugins, signal } from "@expense_tracker/owl";
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
    static components = { ErrorBoundary, PersonalExpenseList };
    busPlugin = plugin(BusPlugin);
    sm = plugin(ScreenManagerPlugin);
    error = signal(null);

    setup() {
        super.setup();
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({ expenses: [] });

        // Show full error in console
        effect(() => {
            const e = this.error();
            if (e) console.error("widget failed:", e);
        });

        onWillStart(async () => {
            const res = await this.model.load_expenses(this.props)
                .catch((error) => {
                    this.error.set(error);
                });
            this.state.expenses = res;
        });
        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // Maybe we just need to define props as signal and it will be done, like we did for PersonalExpenseList where we used signal props + useEffect
        // onWillUpdateProps((nextProps) => this.state.expenses = this.model.load_expenses(nextProps));
    }

    get modelParams() {
        return {};
    }

    _onQuickCreateExpense() {
        this.sm.changeScreen({ screen_name: 'ExpenseForm', props: { model: "personal.expense", isNew: true }});
        this.busPlugin.bus.trigger('change_active_menu', 'expenses' );
    }

    _onQuickCreateCategory() {
        this.sm.changeScreen({ screen_name: 'ExpenseCategoryForm', props: { model: "expense.category", isNew: true }});
        this.busPlugin.bus.trigger('change_active_menu', 'categories' );
    }

    _onExpensesByCategory() {
        this.sm.changeScreen({ screen_name: 'ExpensesByCategory', props: { model: "personal.expense" }});
        this.busPlugin.bus.trigger('change_active_menu', 'reports' );
    }

}

// Dashboard.components = { PersonalExpenseList }

screensRegistry.add("Dashboard", Dashboard);
