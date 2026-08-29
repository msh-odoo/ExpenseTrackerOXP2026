import { Component, useProps, t, Suspense } from "@odoo/owl";

export class Container extends Component {
    static template = "expense_tracker.container";
    static components = { Suspense };
    props = useProps({
        mainScreenProps: t.object().optional({}),
        tname: t.string(),
        component: t.function(),
    });
}
