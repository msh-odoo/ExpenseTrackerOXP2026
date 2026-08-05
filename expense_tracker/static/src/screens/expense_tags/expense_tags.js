import {
    Component,
    proxy,
    useProps,
    OwlError,
    onWillStart,
    onPatched,
    onError,
    signal,
    t,
} from "@odoo/owl";
import { screensRegistry } from "@expense_tracker/registries";
import { useModel } from "../../model/model";
import { ExpenseTrackerModel } from "../../model/expense_tracker_model";

export class TagsList extends Component {
    static template = "expense_tracker.TagsList";
    props = useProps({
        ignoreCreate: t.boolean().optional(),
    });
    config = {
        model: ExpenseTrackerModel,
    };

    setup() {
        this.model = useModel(this.modelParams);
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/signals.html
        this.state = proxy({
            tags: [],
            isAddingNewTag: false,
            newTag: { name: "", color: "" },
            lastAddedTagId: null, // Track the last added tag ID
        });
        this.modelName = "expense.tag";
        this.formElement = signal(null);

        onWillStart(async () => {
            const res = await this.model.load_tags(this.props);
            // this.state.tags = true;
            this.state.tags = res;
        });

        onError((error) => {
            if (error instanceof OwlError) {
                // error originated from Owl (invalid template, missing registry key,
                // failed validation, lifecycle misuse, ...)
                alert(`OwlError: ${error.message}`);
            } else {
                alert("Something went wrong, please contact your administrator.");
                // error from user code or the runtime (TypeError, custom errors, ...)
            }
        });

        onPatched(() => {
            if (this.state.lastAddedTagId !== null) {
                const lastTagElement = this.formElement().querySelector(
                    `#tag-${this.state.lastAddedTagId}`,
                );
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

    async _saveTag() {
        const { newTag, tags } = this.state;
        const { name, color } = newTag;
        if (name && color) {
            const tagId = await this.model.orm.create("expense.tag", [
                {
                    name: name,
                    color: color,
                },
            ]);
            if (tagId) {
                this.state.tags = [
                    ...tags,
                    {
                        id: tagId[0],
                        name: name,
                        color: parseInt(color),
                    },
                ];
                this.state.newTag = { name: "", color: "" };
                this.state.isAddingNewTag = false;

                // Set last added tag ID for highlighting
                this.state.lastAddedTagId = tagId[0];
            }
        }
    }

    _onKeyup(ev) {
        if (ev.key !== "Enter") {
            return;
        }
        this._saveTag();
    }

    async _onFocusin(ev) {
        this._saveTag();
    }

    _onCancelNewTag() {
        this.state.isAddingNewTag = false;
        this.state.newTag = { name: "", color: "" };
    }
}

screensRegistry.add("TagsList", TagsList);
