import {
    Component,
    ErrorBoundary,
    onWillStart,
    proxy,
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
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel(this.modelParams);
        this.state = proxy({ expenses: [] });
        onWillStart(async () => {
            return this.model.load_expenses(this.props)
                .then((res) => {
                    this.state.expenses = res;
                })
                .catch((error) => {
                    this.error.set(error);
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
