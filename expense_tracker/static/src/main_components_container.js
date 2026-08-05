import { Component, xml } from "@odoo/owl";
import { mainComponentsRegistry } from "@expense_tracker/registries";

export class MainComponentsContainer extends Component {
    static template = xml`
    <div class="o-main-components-container">
        <t t-foreach="this.Components.entries()" t-as="C" t-key="C[0]">
            <t t-component="C[1].Component" t-props="C[1].props"/>
        </t>
    </div>
    `;

    setup() {
        this.Components = mainComponentsRegistry;
    }
}
