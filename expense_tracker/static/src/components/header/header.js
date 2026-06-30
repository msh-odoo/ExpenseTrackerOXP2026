
import { Component, proxy, plugin, onMounted } from "@expense_tracker/owl";
import { Time } from "@expense_tracker/components/time/time";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { HotkeyPlugin } from "@expense_tracker/plugins/hotkey_plugin";
import { shortcutResource } from "@expense_tracker/resources";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";

export class Header extends Component {
    static template = "expense_tracker.header";
    static components = { Time };

    setup() {
        this.busPlugin = plugin(BusPlugin);
        this.hotkeyPlugin = plugin(HotkeyPlugin);
        this.sm = plugin(ScreenManagerPlugin);
        this.state = proxy({ activeMenuItem: "home" });
        this.busPlugin.bus.addEventListener("change_active_menu", this.changeActiveMenu.bind(this));
        onMounted(async () => {
            this.hotkeyPlugin.addHotkey("alt+h", () => this.state.activeMenuItem = "home");
        });
    }

    onClickLogo() {
        window.location.href = "/expense_tracker";
    }

    onActivateMenu(ev) {
        const menuName = ev.currentTarget.getAttribute('data-name');
        this.state.activeMenuItem = menuName;
        const screenName = ev.currentTarget.getAttribute('data-screen');
        this.sm.changeScreen({ screen_name: screenName, props: { ignoreCreate: false }});
        // this.busPlugin.bus.trigger('change_screen', { 'screen_name': screenName, ignoreCreate: false });
    }

    changeActiveMenu(ev) {
        this.state.activeMenuItem = ev.detail;
    }
}