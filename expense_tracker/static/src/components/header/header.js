import { Component } from "@odoo/owl";

export class Header extends Component {
    static template = "expense_tracker.header";

    onClickLogo(ev) {
        const logoClickedEvent = new CustomEvent("logo_clicked", {
            detail: {},
            bubbles: true,
        });
        ev.currentTarget.dispatchEvent(logoClickedEvent);
    }
}
