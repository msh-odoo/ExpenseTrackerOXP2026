import { Component, computed, props, proxy, onWillStart, onMounted, onPatched, useEffect, signal, plugin, t, useListener } from '@expense_tracker/owl';
import { screensRegistry } from '@expense_tracker/registries';
import { useModel } from "../../model/model";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { FormViewStatic } from '../../components/formview_static/formview_static';

class ExpenseForm extends Component {
    static template = "expense_tracker.ExpenseForm";
    static components = { FormViewStatic };
    props = props({
        id: t.signal(t.number().optional()),
    });
    busPlugin = plugin(BusPlugin);
    sm = plugin(ScreenManagerPlugin);

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({ data: {}, isValidForm: true });
        this.title = "Expense";
        this.modelName = "personal.expense";
        this.footer = signal(null);
        this.form = signal.ref(HTMLElement);
        const options = {
            model: this.modelName,
            id: this.props.id && this.props.id(),
            fields: ["id", "name", "user_id", "date", "amount", "category_id", "payment_method_id"],
        };
        onWillStart(async () => {
            let res = {};
                res = await this.model.load_expense_form_data(options);
            this.state.data = res;
        });
        const updateState = computed(() => {
            if (this.props.id && this.props.id()) {
                debugger;
                this.state.data = this.model.load_expense_form_data(options);
            }
        });

        useListener(this.form, "click", this._onBounceEffect.bind(this));

        onMounted(() => {
            // debugger;
            this.form().querySelector("input.form-control").focus();
        });

        onPatched(() => {
            this.form().querySelector("input.form-control").focus();
        });

        // useEffect(() => {
        //     if (!this.form()) {
        //         return;
        //     }
        //     useListener(this.form(), "click", this._onBounceEffect.bind(this), {});
        //     return () => {};
        // });
    }

    /**
     * Checks form valid or not based on given value.
     */
    checkFormValid() {
        let isValid = true;
        this.form().querySelectorAll(".form-control").forEach((elem) => {
            if (elem.required && !elem.value) {
                isValid = false;
            }
        });
        this.state.isValidForm = isValid;
    }

    markFormInvalid() {
        this.form.el.classList.toggle('o_invalid', !this.state.isValidForm);
    }

    _onBounceEffect() {
        const buttonEl = this.footer().querySelector("button");
        buttonEl.classList.add("bounce");
        setTimeout(() => {
            buttonEl.classList.remove("bounce");
        }, 500);
    }

    async _onClickSubmitForm(ev) {
        ev.preventDefault();
        this.checkFormValid();
        const newExpense = {
            name: this.form().querySelector(".o_expense_description").value,
            date: this.form().querySelector(".o_expense_date").value,
            amount: this.form().querySelector(".o_expense_amount").value,
            category_id: parseInt(this.form().querySelector("o_expense_category").value),
        };
        if (this.state.data.record) {
            this._updateExpense(newExpense).then(() => {
                this.sm.changeScreen({ screen_name: 'ExpenseList', props: {}});
            });
        } else {
            if (this.state.isValidForm) {
                this._createExpense(newExpense).then(() => {
                    this.sm.changeScreen({ screen_name: 'ExpenseList', props: {}});
                });
            }
        }
    }
    async _createExpense(expense){
        return await this.model.orm.create("personal.expense", [expense]);
    }
    async _updateExpense(expense){
        return await this.model.orm.write("personal.expense", [parseInt(this.props.id())], expense)
    }
}

screensRegistry.add("ExpenseForm", ExpenseForm);
