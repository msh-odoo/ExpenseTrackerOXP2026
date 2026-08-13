import {
    Component,
    effect,
    ErrorBoundary,
    onWillStart,
    proxy,
    usePlugin,
    signal,
    useProps,
} from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { PersonalExpenseList } from "../expense_list/expense_list";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Dashboard extends Component {
    static template = "expense_tracker.Dashboard";
    static components = { ErrorBoundary, PersonalExpenseList };
    busPlugin = usePlugin(BusPlugin);
    sm = usePlugin(ScreenManagerPlugin);
    error = signal(null);
    props = useProps();
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        super.setup();
        this.model = useModel(this.modelParams);
        this.state = proxy({ expenses: [] });

        // Show full error in console
        effect(() => {
            const e = this.error();
            if (e) {
                console.error("widget failed:", e);
            }
        });

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

    get modelParams() {
        return {};
    }

    _onQuickCreateExpense() {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
        this.busPlugin.bus.trigger("change_active_menu", "expenses");
    }

    _onQuickCreateCategory() {
        this.sm.changeScreen({
            screen_name: "ExpenseCategoryForm",
            props: { model: "expense.category", isNew: true },
        });
        this.busPlugin.bus.trigger("change_active_menu", "categories");
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
