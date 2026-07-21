import { Component, proxy, usePlugin, onMounted } from "@odoo/owl";
import { Time } from "@expense_tracker/components/time/time";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { HotkeyPlugin } from "@expense_tracker/plugins/hotkey_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Header extends Component {
    static template = "expense_tracker.header";
    static components = { Time };

    setup() {
        this.busPlugin = usePlugin(BusPlugin);
        this.hotkeyPlugin = usePlugin(HotkeyPlugin);
        this.sm = usePlugin(ScreenManagerPlugin);
        this.state = proxy({ activeMenuItem: "home" });
        this.busPlugin.bus.addEventListener("change_active_menu", this.changeActiveMenu.bind(this));
        onMounted(async () => {
            this.hotkeyPlugin.addHotkey("alt+h", () => (this.state.activeMenuItem = "home"));
        });
    }

    onClickLogo() {
        window.location.href = "/expense_tracker";
    }

    onActivateMenu(ev) {
        const menuName = ev.currentTarget.getAttribute("data-name");
        this.state.activeMenuItem = menuName;
        const screenName = ev.currentTarget.getAttribute("data-screen");
        this.sm.changeScreen({ screen_name: screenName, props: { ignoreCreate: false }});
    }

    changeActiveMenu(ev) {
        this.state.activeMenuItem = ev.detail;
    }
}