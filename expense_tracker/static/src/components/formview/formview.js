import { Component, signal, proxy, useProps, onMounted, t } from "@odoo/owl";

export class FormView extends Component {
    static template = "expense_tracker.FormView";
    props = useProps({
        newCategory: t.function().optional(),
        data: t.object().optional(),
    });
    setup() {
        super.setup();
        this.signals = {};
        this.formElement = signal.ref();
        const { record } = this.props.data;
        this.state = proxy({ data: record });
        this.record = Object.keys(record).filter((key) => key !== "id");
        for (const key in record) {
            this.signals[key] = signal(this.state.data[key]);
        }

        onMounted(() => {
            const el = this.formElement();
            el.querySelector("input.form-control").focus();
        });
    }
}
