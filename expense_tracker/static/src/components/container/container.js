
import { Component, props, types as t, } from "@expense_tracker/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    props = props();
    // For further details check: https://github.com/odoo/owl/blob/master/tools/playground/samples/tutorials/hibou_os/14/window.js
    props = props({
        "mainScreenProps?": t.object(),
        tname: t.string(),
        component: t.function(),
    }, { mainScreenProps: {} });
    // static props = {
    //     mainScreenProps: { type: Object, optional: true },
    //     tname: { type: String },
    //     component: { type: Function }
    // };
    // static defaultProps = {
    //     mainScreenProps: {},
    // };
}
