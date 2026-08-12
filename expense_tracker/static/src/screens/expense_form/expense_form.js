import { Component, signal, useListener, useEffect } from '@odoo/owl';
import { screensRegistry } from "@expense_tracker/registries";

class ExpenseForm extends Component {
    static template = "expense_tracker.ExpenseForm";

    setup() {
        this.title = "Expense";
        this.state = proxy({ data: {}, isValidForm: true });
        this.footer = signal(null);
        this.form = signal.ref(HTMLElement);
        useListener(this.form, "click", this._onBounceEffect.bind(this));
        onWillStart(async () => {
            const res = {
                record: {
                    id: 1,
                    name: "Brunch at Hotel Leela",
                    date: "2024-08-21",
                    amount: 2000.00,
                    category_id: [1, "Food"]
                },
                categories: [
                    {id: 1, name: "Food"},
                    {id: 2, name: "Travel"},
                    {id: 3, name: "Entertaintment"},
                ],
            };
            this.state.data = res;
        });
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
