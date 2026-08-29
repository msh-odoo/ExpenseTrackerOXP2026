import { registry } from "@web/core/registry";
import { LazyComponent } from "@web/core/lazy_component";
import { Component, xml } from "@odoo/owl";

class AwesomeDashboardLoader extends Component {
    static components = { LazyComponent };
    static template = xml`
    <LazyComponent bundle="'expense_tracker_dashboard.dashboard'" Component="'ExpenseDashboard'" props="props"/>
    `;
}

registry.category("actions").add("expense_tracker_dashboard.dashboard", AwesomeDashboardLoader);
