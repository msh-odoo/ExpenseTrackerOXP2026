import { Component, signal, t, useProps } from "@odoo/owl";

export class Dialog extends Component {
    static template = "expense_tracker.Dialog";
    // don't do this, it is only temporary to allow the dialog props to be
    // overridden.
    props = useProps();
    // Ref on the modal element, either owned by the parent (`modalRef` prop) or local.
    modalRef = useProps.static(
        "modalRef",
        t.signal(t.ref()).optional(() => signal.ref()),
    );

    setup() {
        this.id = `dialog_${this.props.id}`;
    }

    get size() {
        return this.props.size;
    }

    get design() {
        return ["sm", "md"].includes(this.size) ? "minimal" : "default";
    }

    onResize() {
        this.position.left = 0;
        this.position.top = 0;
    }

    onEscape() {
        return this.dismiss();
    }

    async dismiss() {
        if (this.data.dismiss) {
            await this.data.dismiss();
        }
        return this.data.close({ dismiss: true });
    }
}
