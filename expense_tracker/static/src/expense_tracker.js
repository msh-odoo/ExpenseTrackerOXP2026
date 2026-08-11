import { Component, usePlugin, providePlugins } from "@odoo/owl";
import { Header } from "./components/header/header";
import { Container } from "./components/container/container";
import { PersonalExpenseList } from "./screens/expense_list/expense_list";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        providePlugins([ScreenManagerPlugin]);
        this.sm = usePlugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "PersonalExpenseList", component: PersonalExpenseList });
    }

    _onLogoClicked(ev) {
        this.sm.changeScreen({ screen_name: "Dashboard", props: {} });
    }
}
