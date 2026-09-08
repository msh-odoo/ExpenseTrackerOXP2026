import { Component, providePlugins, usePlugin, xml } from "@odoo/owl";
import { Header } from "./components/header/header";
import { Container } from "./components/container/container";
import { screensRegistry } from "@expense_tracker/registries";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { Dashboard } from "./screens/expense_dashboard/expense_dashboard";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        providePlugins([BusPlugin]);
        this.sm = usePlugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "Dashboard", component: Dashboard });
    }

    _onLogoClicked(ev) {
        this.sm.changeScreen({ screen_name: "Dashboard", props: {} });
    }
}
