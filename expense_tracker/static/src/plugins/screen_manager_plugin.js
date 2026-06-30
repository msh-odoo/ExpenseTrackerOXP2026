import { Plugin, signal } from "@expense_tracker/owl";
// import { Dashboard } from "@expense_tracker/screens/expense_dashboard/expense_dashboard";

export class ScreenManagerPlugin extends Plugin {
    currentScreenName = signal("");
    currentScreenComponent = signal("");
    currentScreenProps = {};

    initCurrentScreen(config) {
        this.currentScreenName = config.name;
        this.currentScreenComponent = config.component;
    }

    /**
     * Used to give the `state.mobileSearchBarIsShown` value to main screen props
     */
    get currentScreenPropsFielded() {
        return Object.assign({}, this.currentScreenProps);
    }

    /**
     * Called when main screen is changed
     * @param {Event} ev 
     */
    changeScreen(config) {
        debugger;
        const screen = screensRegistry.get(config.screen_name)
        this.currentScreenName = config.screen_name;
        this.currentScreenComponent = screen;
        this.currentScreenProps = { ...config.props };
    }
}
