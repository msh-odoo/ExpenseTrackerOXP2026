
import { Component, props, types as t, } from "@expense_tracker/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    // For further details check: https://github.com/odoo/owl/blob/master/tools/playground/samples/tutorials/hibou_os/14/window.js
    props = props({
        mainScreenProps: t.object().optional({}),
        tname: t.string(),
        component: t.function(),
    });
}
