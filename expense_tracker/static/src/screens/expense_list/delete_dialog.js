import { Component } from "@odoo/owl";
import { Dialog } from "@expense_tracker/core/dialog/dialog";

export class DeleteDialog extends Component {
    static template = "expense_tracker.DeleteDialog";
    static components = {
        Dialog,
    };
}
