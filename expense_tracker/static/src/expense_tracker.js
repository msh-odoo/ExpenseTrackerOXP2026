import { Container } from "@expense_tracker/components/container/container";
import { Component, registry, proxy, plugin, providePlugins } from "@expense_tracker/owl";
import { Dashboard } from "@expense_tracker/screens/expense_dashboard/expense_dashboard";
import { Header } from "@expense_tracker/components/header/header";
import { rpc } from "@expense_tracker/core/rpc";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    // static components = { Header, Container };
    static components = { Header };

    setup() {
        super.setup();
        // const orm = new ORM(); // TODO: MSH: Remove ORM from dependency as we want to developer standalone app
        // Use of useSubEnv to pass orm to this component as well as all it's children
        // useSubEnv({ orm, rpc });
        // useSubEnv({ rpc }); // useSubEnv is removed in owl3
        this.mainScreen = proxy({ name: 'Dashboard', component: Dashboard });
        providePlugins([BusPlugin]);
        const busPlugin = plugin(BusPlugin);
        busPlugin.bus.addEventListener("change_screen", this.onChangeScreen.bind(this));
        // this.env.bus.addEventListener("add_dialog", this.onAddDialog.bind(this));
        this.mainScreenProps = {};
    }

    /**
     * Used to give the `state.mobileSearchBarIsShown` value to main screen props
     */
    get mainScreenPropsFielded() {
        return Object.assign({}, this.mainScreenProps);
    }

    /**
     * Called when main screen is changed
     * @param {Event} ev 
     */
    onChangeScreen(ev) {
        debugger;
        const screenRegistry = registry.category("screens");
        const screen = screenRegistry.get(ev.detail.screen_name)
        this.mainScreen.name = ev.detail.screen_name;
        this.mainScreen.component = screen;
        this.mainScreenProps = { ...ev.detail };
    }
}
