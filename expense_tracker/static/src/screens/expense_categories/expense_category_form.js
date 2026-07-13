import { Component, proxy, plugin, onWillStart } from "@expense_tracker/owl";
import { useModel } from "../../model/model";
import { screensRegistry } from "@expense_tracker/registries";
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ScreenManagerPlugin } from "@expense_tracker/plugins/screen_manager_plugin";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { FormView } from "../../components/formview/formview";

class ExpenseCategoryForm extends Component {
    static template = "expense_tracker.ExpenseCategoryForm";
    static components = { FormView };

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({
            data: {
                record: { name: "", icon: "", description: "" },
                record_fields: {
                    name: { string: "Name" },
                    icon: { string: "Icon" },
                    description: { string: "Description" },
                },
            },
        });
        this.title = "Category";
        this.modelName = "expense.category";
        this.busPlugin = plugin(BusPlugin);
        this.sm = plugin(ScreenManagerPlugin);

        onWillStart(async () => {
            if (this.props.id) {
                await this.loadData(this.props.id);
            }
        });
    }

    async loadData(id) {
        const options = {
            model: this.modelName,
            id: id,
            fields: ["name", "icon", "description"],
        };
        const res = await this.model.load_data(options);
        this.state.data = res;
    }

    async _onAddCategory(newCategory) {
        if (newCategory.id) {
            await this.model.orm.write("expense.category", [newCategory.id], {
                name: newCategory.name,
                icon: newCategory.icon,
                description: newCategory.description,
            });
        } else {
            await this.model.orm.create("expense.category", [
                {
                    name: newCategory.name,
                    icon: newCategory.icon,
                    description: newCategory.description,
                },
            ]);
        }
        this.sm.changeScreen({ screen_name: "CategoriesList", props: {} });
    }
}

screensRegistry.add("ExpenseCategoryForm", ExpenseCategoryForm);
