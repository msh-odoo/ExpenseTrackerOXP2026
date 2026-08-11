import { Component, proxy, usePlugin } from "@odoo/owl";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Header extends Component {
    static template = "expense_tracker.header";

    setup() {
        this.sm = usePlugin(ScreenManagerPlugin);
        this.state = proxy({ activeMenuItem: "home" });
    }

    onActivateMenu(ev) {
        const menuName = ev.currentTarget.getAttribute("data-name");
        this.state.activeMenuItem = menuName;
        const screenName = ev.currentTarget.getAttribute("data-screen");
        this.sm.changeScreen({ screen_name: screenName, props: { ignoreCreate: false } });
    }
}
