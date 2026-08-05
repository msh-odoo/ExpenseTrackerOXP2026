import { Component, Portal, usePlugin, providePlugins } from "@odoo/owl";
import { Container } from "@expense_tracker/components/container/container";
import { Dashboard } from "@expense_tracker/screens/expense_dashboard/expense_dashboard";
import { MainComponentsContainer } from "@expense_tracker/main_components_container";
import { Header } from "@expense_tracker/components/header/header";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/component.html
export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container, Portal, MainComponentsContainer };

    setup() {
        this.document = document;
        super.setup();
        providePlugins([ScreenManagerPlugin]);
        this.sm = usePlugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "Dashboard", component: Dashboard });
    }

    _onLogoClicked(ev) {
        this.sm.changeScreen({ screen_name: "Dashboard", props: {} });
    }
}
