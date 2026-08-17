import { Component, computed, signal, proxy, onWillStart, useListener, useEffect, useProps, usePlugin, t } from '@odoo/owl';
import { screensRegistry } from "@expense_tracker/registries";
import { FormViewStatic } from "../../components/formview_static/formview_static";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { useModel } from "../../model/model";

class ExpenseForm extends Component {
    static template = "expense_tracker.ExpenseForm";
    static components = { FormViewStatic }
    props = useProps({
        id: t.number().optional(),
    });
    sm = usePlugin(ScreenManagerPlugin);
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel();
        this.title = "Expense";
        this.modelName = "personal.expense";
        this.state = proxy({ data: {}, isValidForm: true });
        this.footer = signal(null);
        this.form = signal.ref(HTMLElement);
        const options = {
            model: this.modelName,
            id: this.props.id,
            fields: ["id", "name", "user_id", "date", "amount", "category_id", "payment_method_id"],
        };
        onWillStart(async () => {
            const res = await this.model.load_expense_form_data(options);
            this.state.data = res;
        });
        computed(() => {
            if (this.props.id && this.props.id()) {
                this.state.data = this.model.load_expense_form_data(options);
            }
        });

        useListener(this.form, "click", this._onBounceEffect.bind(this));
        this.descriptionInput = signal.ref();
        useEffect(() => {
            const el = this.descriptionInput();
            if (el) {
                el.focus();
            }
        });
    }

    /**
     * Checks form valid or not based on given value.
     */
    checkFormValid() {
        let isValid = true;
        this.form()
            .querySelectorAll(".form-control")
            .forEach((elem) => {
                if (elem.required && !elem.value) {
                    isValid = false;
                }
            });
        this.state.isValidForm = isValid;
    }

    markFormInvalid() {
        this.form.el.classList.toggle("o_invalid", !this.state.isValidForm);
    }

    async _onClickSubmitForm(ev) {
        ev.preventDefault();
        this.checkFormValid();
        const newExpense = {
            name: this.form().querySelector(".o_expense_description").value,
            date: this.form().querySelector(".o_expense_date").value,
            amount: this.form().querySelector(".o_expense_amount").value,
            category_id: parseInt(this.form().querySelector(".o_expense_category").value),
        };
        if (this.state.data.record) {
            this._updateExpense(newExpense).then(() => {
                this.sm.changeScreen({ screen_name: "ExpenseList", props: {} });
            });
        } else {
            if (this.state.isValidForm) {
                this._createExpense(newExpense).then(() => {
                    this.sm.changeScreen({ screen_name: "ExpenseList", props: {} });
                });
            }
        }
    }
    async _createExpense(expense) {
        return await this.model.orm.create("personal.expense", [expense]);
    }
    async _updateExpense(expense) {
        return await this.model.orm.write("personal.expense", [parseInt(this.props.id)], expense);
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
