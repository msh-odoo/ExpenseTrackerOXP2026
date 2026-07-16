import { Container } from "@expense_tracker/components/container/container";
import { Component, usePlugin, providePlugins } from "@expense_tracker/owl";
import { Dashboard } from "@expense_tracker/screens/expense_dashboard/expense_dashboard";
import { Header } from "@expense_tracker/components/header/header";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/component.html
export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        providePlugins([ScreenManagerPlugin]);
        this.sm = usePlugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "Dashboard", component: Dashboard });
    }
}
