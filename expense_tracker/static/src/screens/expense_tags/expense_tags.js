import { Component, useState, onWillStart, onPatched, useRef } from '@expense_tracker/owl';
import { screensRegistry } from '../registries';
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class TagsList extends Component {
    static template = 'expense_tracker.TagsList';

    setup() {
        this.model = useModel(ExpenseTrackerModel, this.modelParams);
        this.state = useState({
            tags: [],
            isAddingNewTag: false,
            newTag: { name: '', color: '' },
            lastAddedTagId: null // Track the last added tag ID
        });
        this.modelName = "expense.tag";
        this.formEl = useRef("formElement");

        onWillStart(async () => {
            const res = await this.model.load_tags(this.props);
            this.state.tags = res;
        });

        // TODO: MSH: onWillUpdateProps is removed, should be managed with signal and computed combination
        // onWillUpdateProps((nextProps) => {
        //     this.state.tags = this.model.load_tags(nextProps);
        // });

        onPatched(() => {
            if (this.state.lastAddedTagId !== null) {
                const lastTagElement = this.formEl.el.querySelector(`#tag-${this.state.lastAddedTagId}`);
                if (lastTagElement) {
                    lastTagElement.classList.add("table-info");
                    setTimeout(() => {
                        lastTagElement.classList.remove("table-info");
                        this.state.lastAddedTagId = null;
                    }, 500);
                }
            }
        });
    }

    _onCreateTags() {
        this.state.isAddingNewTag = true;
    }

    async _onFieldFocusOut() {
        const { newTag, tags } = this.state;
        const { name, color } = newTag;
        if (name && color) {
            const tagId = await this.model.orm.create("expense.tag", [{
                name: name,
                color: color,
            }]);
            if (tagId) {
                this.state.tags = [
                    ...tags,
                    {
                        id: tagId[0],
                        name: name,
                        color: parseInt(color),
                    },
                ];
                this.state.newTag = { name: '', color: '' };
                this.state.isAddingNewTag = false;

                // Set last added tag ID for highlighting
                this.state.lastAddedTagId = tagId[0];
            }
        }
    }

    _onCancelNewTag() {
        this.state.isAddingNewTag = false;
        this.state.newTag = { name: '', color: '' };
    }
}

screensRegistry.add("TagsList", TagsList);
