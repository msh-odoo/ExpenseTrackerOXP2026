import { Plugin, signal } from "@expense_tracker/owl";
import { screensRegistry } from "@expense_tracker/registries";

export class ScreenManagerPlugin extends Plugin {
    currentScreenName = signal("");
    currentScreenComponent = signal(null);
    currentScreenProps = {};

    initCurrentScreen(config) {
        this.currentScreenName.set(config.name);
        this.currentScreenComponent.set(config.component);
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
        const screen = screensRegistry.get(config.screen_name)
        this.currentScreenName.set(config.screen_name);
        this.currentScreenComponent.set(screen);
        this.currentScreenProps = { ...config.props };
    }
}
