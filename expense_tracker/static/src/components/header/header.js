import { Component, proxy, usePlugin, onMounted } from "@odoo/owl";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { HotkeyPlugin } from "@expense_tracker/plugins/hotkey_plugin";
import { Time } from "../timer/timer";

export class Header extends Component {
    static template = "expense_tracker.header";
    static components = { Time };

    setup() {
        this.sm = usePlugin(ScreenManagerPlugin);
        this.hotkeyPlugin = usePlugin(HotkeyPlugin);
        this.state = proxy({ activeMenuItem: "home" });
        onMounted(async () => {
            this.hotkeyPlugin.addHotkey("alt+h", () => (this.state.activeMenuItem = "home"));
        });
    }

    onActivateMenu(ev) {
        const menuName = ev.currentTarget.getAttribute("data-name");
        this.state.activeMenuItem = menuName;
        const screenName = ev.currentTarget.getAttribute("data-screen");
        this.sm.changeScreen({ screen_name: screenName, props: { ignoreCreate: false } });
    }

    onClickLogo(ev) {
        const logoClickedEvent = new CustomEvent("logo_clicked", {
            detail: {},
            bubbles: true,
        });
        ev.currentTarget.dispatchEvent(logoClickedEvent);
        this.state.activeMenuItem = "home";
    }
}
