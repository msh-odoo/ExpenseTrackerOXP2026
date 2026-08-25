import { Component, xml } from "@odoo/owl";

class SubComponent extends Component {
    static template = xml`<h1>Hello World</h1>`;
}

export class ExpenseTracker extends Component {
    static template = xml`
    <div><h1>Expense Tracker App</h1></div>
    <SubComponent/>
    `;
    static components = { SubComponent }
}
