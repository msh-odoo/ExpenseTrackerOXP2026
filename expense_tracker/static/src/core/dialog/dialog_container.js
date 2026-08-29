import { Component, useProps, xml } from "@odoo/owl";

export class DialogContainer extends Component {
    static template = xml`
    <div class="o-dialog-container">
        <t t-foreach="Object.values(this.props.dialogs)" t-as="D" t-key="D.id">
            <t t-component="D.DialogClass" t-props="D.props"/>
        </t>
    </div>
    `;
    props = useProps();
}
