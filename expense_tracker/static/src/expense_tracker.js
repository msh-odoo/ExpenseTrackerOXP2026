import { Component, xml } from "@odoo/owl";
import { Header } from "./components/header/header";
import { Container } from "./components/container/container";
import { screensRegistry } from "@expense_tracker/registries";

export class ExpenseTracker extends Component {
    static template = "expense_tracker.root";
    static components = { Header, Container };

    setup() {
        super.setup();
        const screen = screensRegistry.get("ExpenseList");
        this.mainScreen = { name: screen.constructor.name, component: screen };
        this.mainScreenProps = {};
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
