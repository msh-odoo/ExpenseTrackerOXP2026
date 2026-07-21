import { Component, signal } from "@odoo/owl";

export class FormViewStatic extends Component {
    static template = "expense_tracker.FormViewStatic";
    setup() {
        this.formElement = signal(null);
        super.setup();
    }
}
