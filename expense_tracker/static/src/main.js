import { App, whenReady } from "@odoo/owl";
import { ExpenseTracker } from "@expense_tracker/expense_tracker";

whenReady(async () => {
    if (!document.querySelector(".o_expense_tracker")) {
        return;
    }

    const app = new App({});
    const root = app.createRoot(ExpenseTracker, {});
    await root.mount(document.body);
});
