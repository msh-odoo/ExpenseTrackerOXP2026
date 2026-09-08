import { Component, proxy, signal, useListener, useEffect } from '@odoo/owl';
import { screensRegistry } from "@expense_tracker/registries";

class ExpenseForm extends Component {
    static template = "expense_tracker.ExpenseForm";
    setup() {
        this.title = "Expense";
        this.state = proxy({ data: {}, isValidForm: true });
        this.footer = signal.ref(null);
        this.form = signal.ref(HTMLElement);
        useListener(this.form, "click", this._onBounceEffect.bind(this));
        this.descriptionInput = signal.ref();
        useEffect(() => {
            const el = this.descriptionInput();
            if (el) {
                el.focus();
            }
        });
    }

    _onBounceEffect() {
        const buttonEl = this.footer().querySelector("button");
        buttonEl.classList.add("bounce");
        setTimeout(() => {
            buttonEl.classList.remove("bounce");
        }, 500);
    }
}

screensRegistry.add("ExpenseForm", ExpenseForm);
