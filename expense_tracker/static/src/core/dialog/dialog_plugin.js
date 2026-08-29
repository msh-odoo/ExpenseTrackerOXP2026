import { Plugin, proxy } from "@odoo/owl";
import { mainComponentsRegistry } from "@expense_tracker/registries";
import { DialogContainer } from "@expense_tracker/core/dialog/dialog_container";

export class DialogPlugin extends Plugin {
    setup() {
        this.dialogs = proxy({});

        mainComponentsRegistry.add("DialogContainer", {
            Component: DialogContainer,
            props: { dialogs: this.dialogs },
        });
    }

    add(DialogClass, props = {}, options = {}) {
        const id = options.id || Math.random().toString(36).substring(2, 15);
        props = { ...props, id };
        this.dialogs[id] = {
            id,
            DialogClass,
            props,
            sequence: options.sequence ?? 50,
        };
        return () => {
            delete this.dialogs[id];
        };
    }
}
