import { Component, useProps, types as t } from "@expense_tracker/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    // For further details check: https://github.com/odoo/owl/blob/master/tools/playground/samples/tutorials/hibou_os/14/window.js
    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/types_validation.html
    props = useProps({
        mainScreenProps: t.object().optional({}),
        tname: t.string(),
        component: t.function(),
    });
}
