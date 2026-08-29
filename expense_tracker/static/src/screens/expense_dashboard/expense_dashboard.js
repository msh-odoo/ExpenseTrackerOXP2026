import {
    Component,
    ErrorBoundary,
    onWillStart,
    proxy,
    signal,
    usePlugin,
} from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { PersonalExpenseList } from "../expense_list/expense_list";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { useModel } from "../../models/model";
import { ExpenseTrackerModel } from "../../models/expense_tracker_model";

export class Dashboard extends Component {
    static template = "expense_tracker.Dashboard";
    static components = { ErrorBoundary, PersonalExpenseList };
    sm = usePlugin(ScreenManagerPlugin);
    busPlugin = usePlugin(BusPlugin);
    error = signal(null);
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel(this.modelParams);
        this.state = proxy({ expenses: [] });
        onWillStart(async () => {
            const prom = new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 4000);
            });
            const expenses = this.model.load_expenses(this.props).catch((error) => {
                this.error.set(error);
            });
            return Promise.all([prom, expenses]).then(([promRes, res]) => {
                this.state.expenses = res;
            });
        });
    }

    _onQuickCreateExpense() {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
        this.busPlugin.bus.trigger("change_active_menu", { activeMenu: "expenses" });
    }

    _onQuickCreateCategory() {
        this.sm.changeScreen({
            screen_name: "ExpenseCategoryForm",
            props: { model: "expense.category", isNew: true },
        });
        this.busPlugin.bus.trigger("change_active_menu", { activeMenu: "categories" });
    }

    _onExpensesByCategory() {
        this.sm.changeScreen({
            screen_name: "ExpensesByCategory",
            props: { model: "personal.expense" },
        });
        this.busPlugin.bus.trigger("change_active_menu", "reports");
    }
}

screensRegistry.add("Dashboard", Dashboard);
