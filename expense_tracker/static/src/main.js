import { App, EventBus } from "@expense_tracker/owl";
// import { browser } from "@web/core/browser/browser";
import { rpc } from "@expense_tracker/core/rpc";
import { DB } from "@expense_tracker/core/db";
import { getTemplate } from "@expense_tracker/core/templates";
import { ExpenseTracker } from "@expense_tracker/expense_tracker";
import { BusPlugin } from "./plugins/bus_plugin";
import { ORMPlugin } from "./plugins/orm_plugin";
import { HotkeyPlugin } from "./plugins/hotkey_plugin";


function cast(value) {
    return !value || isNaN(value) ? value : Number(value);
}

function parseString(str) {
    const parts = str.split("&");
    const result = {};
    for (const part of parts) {
        const [key, value] = part.split("=");
        const decoded = decodeURIComponent(value || "");
        result[key] = cast(decoded);
    }
    return result;
}

function parseHash() {
    const location = window.location;
    const { pathname, search, hash } = location;
    return hash && hash !== "#" ? parseString(hash.slice(1)) : {};
}

// The following code ensures that owl mount the component when ready.
// `templates` contains templates contained in the bundles.
//
// In the mount options, it's also possible to add other interresting
// configuration: https://github.com/odoo/owl/blob/master/doc/reference/app.md#configuration

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/utils.html
owl.whenReady(async () => {
    const db = new DB(); // TODO: MSH: Convert it to plugin
    const env = { db, rpc };

    // fr_FR translations
    const hash = parseHash();

    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/translations.html
    const translations = {};
    if (hash.lang) {
        const terms = {
            "Home": "Accueil",
            "Expenses": "Dépenses",
            "Categories": "Catégories",
            "Tags": "Étiquettes",
            "Error:": "Erreur:",
            "Retry": "Réessayer",
            "Dashboard": "Tableau de bord",
            "Quick Access": "Accès rapide",
            "New Expense": "Nouvelle dépense",
            "New Category": "Nouvelle catégorie",
            "Expenses by Category": "Dépenses par catégorie",
            "Personal Expenses": "Dépenses personnelles",
            "Create Expense": "Créer une dépense",
            "Delete Expense": "Supprimer la dépense",
            "Expense Tracker": "Suivi des dépenses",
            "Personal Expenses": "Dépenses personnelles",
            "Add New Expense": "Ajouter une nouvelle dépense",
            "Edit": "Modifier",
            "Delete": "Supprimer",
            "Description:": "Description:",
            "Date:": "Date:",
            "Amount:": "Montante:",
            "Category:": "Catégorie:",
            "Description": "Description",
            "Date": "Date",
            "Amount": "Montante",
            "Category": "Catégorie",
            "Total Amount:": "Montant total:",
        };
        Object.assign(translations, terms);
    }

    const translateFn = (str, ctx) => {
        return translations[str] || str;
    }

    // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/app.html
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    const app = new App({
        getTemplate,
        plugins: [BusPlugin, ORMPlugin, HotkeyPlugin],
        dev: debug || false,
        // warnIfNoStaticProps: true, // !session.test_mode,
        name: ExpenseTracker.constructor.name,
        // translatableAttributes: ["data-tooltip"],
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
    let error = ev ?.error || ev.reason;

    if (error.seen) {
        // If an error causes the mount to crash, Owl will reject the mount promise and throw the
        // error. Therefore, this if statement prevents the same error from appearing twice.
        return;
    }
    error.seen = true;

    let errorMessage = error.stack;
    while (error.cause) {
        errorMessage += "\nCaused by: "
        errorMessage += error.cause.stack;
        error = error.cause;
    }
    console.error(errorMessage);
}

window.addEventListener("error", (ev) => {logError(ev)});
window.addEventListener("unhandledrejection", (ev) => {logError(ev)});
