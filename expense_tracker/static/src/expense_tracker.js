import { Container } from "@expense_tracker/components/container/container";
import { Component, proxy, plugin, providePlugins } from "@expense_tracker/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { Dashboard } from "@expense_tracker/screens/expense_dashboard/expense_dashboard";
import { Header } from "@expense_tracker/components/header/header";
import { rpc } from "@expense_tracker/core/rpc";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        // const orm = new ORM(); // TODO: MSH: Remove ORM from dependency as we want to developer standalone app
        // Use of useSubEnv to pass orm to this component as well as all it's children
        // useSubEnv({ orm, rpc });
        // useSubEnv({ rpc }); // useSubEnv is removed in owl3
        // providePlugins([BusPlugin]); // Not needed as we have passed plugins from App
        providePlugins([ScreenManagerPlugin]);
        this.sm = plugin(ScreenManagerPlugin);
        this.sm.initCurrentScreen({ name: "Dashboard", component: Dashboard });
        // busPlugin.bus.addEventListener("add_dialog", this.onAddDialog.bind(this));
    }

}
