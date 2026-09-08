import {
    Component,
    ErrorBoundary,
    usePlugin,
} from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { PersonalExpenseList } from "../expense_list/expense_list";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Dashboard extends Component {
    static template = "expense_tracker.Dashboard";
    static components = { ErrorBoundary, PersonalExpenseList };
    sm = usePlugin(ScreenManagerPlugin);

    setup() {
        this.state = {
            expenses: [
                {
                    description: "Lunch at Leela Hotel",
                    date: "2024-06-01",
                    amount: 2000.0,
                },
            ],
        };
    }

    _onQuickCreateExpense() {
        this.sm.changeScreen({
            screen_name: "ExpenseForm",
            props: { model: "personal.expense", isNew: true },
        });
    }

    _onQuickCreateCategory() {
        console.log("Quick Create Category to implement")
    }

    _onExpensesByCategory() {
        console.log("Expenses by Category to implement")
    }
}

screensRegistry.add("Dashboard", Dashboard);
