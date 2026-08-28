import { Component, usePlugin, xml } from "@odoo/owl";
import { Header } from "./components/header/header";
import { Container } from "./components/container/container";
import { screensRegistry } from "@expense_tracker/registries";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { Dashboard } from "./screens/expense_dashboard/expense_dashboard";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        this.sm = usePlugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "Dashboard", component: Dashboard });
    }

    /**
     * Used to give the `state.mobileSearchBarIsShown` value to main screen props
     */
    get mainScreenPropsFielded() {
        return Object.assign({
            hasButtons: true,
            showFooter: false,
        }, this.mainScreenProps);
    }
}
