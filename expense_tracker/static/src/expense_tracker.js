import { Component, usePlugin, xml } from "@odoo/owl";
import { Header } from "./components/header/header";
import { Container } from "./components/container/container";
import { screensRegistry } from "@expense_tracker/registries";
import { PersonalExpenseList } from "./screens/expense_list/expense_list";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        this.sm = usePlugin(ScreenManagerPlugin);
        this.state = {
            expenses: [
                {
                    description: "Lunch at Leela Hotel",
                    date: "2024-06-01",
                    amount: 2000.0,
                },
            ],
        };
        this.sm.currentScreenProps = Object.assign({}, this.sm.currentScreenProps, {
            hasButtons: true,
            showFooter: false,
            expenses: this.state.expenses,
        });
        this.sm.initCurrentScreen({ name: "PersonalExpenseList", component: PersonalExpenseList });
    }
}
