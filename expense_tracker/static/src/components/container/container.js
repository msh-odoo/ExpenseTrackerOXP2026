import { Component, useProps, t } from "@odoo/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    props = useProps({
        mainScreenProps: t.object().optional({}),
        tname: t.string(),
        component: t.function(),
    });
}
