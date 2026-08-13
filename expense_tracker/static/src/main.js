import { App, whenReady } from "@odoo/owl";
import { BusPlugin } from "./plugins/bus_plugin";
import { ORMPlugin } from "./plugins/orm_plugin";
import { HotkeyPlugin } from "./plugins/hotkey_plugin";
import { getTemplate } from "@web/core/templates";
import { ExpenseTracker } from "@expense_tracker/expense_tracker";
import { translateFn } from "./translate";

whenReady(async () => {
    if (!document.querySelector(".o_expense_tracker")) {
        return;
    }

    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/app.html
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get("debug");
    const app = new App({
        getTemplate,
        plugins: [BusPlugin, ORMPlugin, HotkeyPlugin],
        dev: debug || false,
        name: ExpenseTracker.constructor.name,
        translateFn,
    });
    const root = app.createRoot(ExpenseTracker, {});
    await root.mount(document.body);
});


/**
 * This code is iterating over the cause property of an error object to console.error a string
 * containing the stack trace of the error and any errors that caused it.
 * @param {Event} ev
 */
function logError(ev) {
    ev.preventDefault();
    let error = ev?.error || ev.reason;

    if (error.seen) {
        // If an error causes the mount to crash, Owl will reject the mount promise and throw the
        // error. Therefore, this if statement prevents the same error from appearing twice.
        return;
    }
    error.seen = true;

    let errorMessage = error.stack;
    while (error.cause) {
        errorMessage += "\nCaused by: ";
        errorMessage += error.cause.stack;
        error = error.cause;
    }
    console.error(errorMessage);
}

window.addEventListener("error", (ev) => {
    logError(ev);
});
window.addEventListener("unhandledrejection", (ev) => {
    logError(ev);
});