
import { Component } from "@expense_tracker/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    static props = {
        mainScreenProps: { type: Object, optional: true },
        tname: { type: String },
        component: { type: Function }
    };
    static defaultProps = {
        mainScreenProps: {},
    };
}
