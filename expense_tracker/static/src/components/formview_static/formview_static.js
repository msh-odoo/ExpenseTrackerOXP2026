import { Component, signal, useProps, t } from "@odoo/owl";

export class FormViewStatic extends Component {
    static template = "expense_tracker.FormViewStatic";
    props = useProps({
        formElement: signal(t.instanceOf(HTMLElement).optional()),
    });
    setup() {
        this.formElement = signal(null);
        super.setup();
    }
}
