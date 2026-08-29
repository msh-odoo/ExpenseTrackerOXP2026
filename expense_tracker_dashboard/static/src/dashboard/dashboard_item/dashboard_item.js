import { Component, useProps, t } from "@odoo/owl";

export class DashboardItem extends Component {
    static template = "awesome_dashboard.DashboardItem"
    props = useProps({
        slots: t.object({ default: t.any() }),
        size: t.number().optional(1),
    });
}
