import { Component, proxy, providePlugins, onWillStart } from '@expense_tracker/owl';
import { useModel } from "../../model/model";
import { screensRegistry } from '../registries';
import { BusPlugin } from "@expense_tracker/plugins/bus_plugin";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";
import { FormView } from '../../components/formview/formview';

class ExpenseCategoryForm extends Component {
    static template = "expense_tracker.ExpenseCategoryForm";
    static components = { FormView };

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = proxy({
            data: {
                record: { name: '', icon: '', description: '' },
                record_fields: {
                    name: { string: 'Name' },
                    icon: { string: 'Icon' },
                    description: { string: 'Description' }
                }
            }
        });
        this.title = "Category";
        this.modelName = "expense.category";
        providePlugins([BusPlugin]);
        this.busPlugin = plugin(BusPlugin);

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
        if(newCategory.id) {
            await this.model.orm.write("expense.category", [newCategory.id], {
                name: newCategory.name,
                icon: newCategory.icon,
                description: newCategory.description
            })
        } else {
            await this.model.orm.create("expense.category", [{
                name: newCategory.name,
                icon: newCategory.icon,
                description: newCategory.description
            }])
        }
        this.busPlugin.bus.trigger('change_screen', { 'screen_name': 'CategoriesList' });
    }
}

screensRegistry.add("ExpenseCategoryForm", ExpenseCategoryForm);
