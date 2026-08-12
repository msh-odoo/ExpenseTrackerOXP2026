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
    const { hash } = location;
    return hash && hash !== "#" ? parseString(hash.slice(1)) : {};
}

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/translations.html
const translations = {};

// fr_FR translations
const hash = parseHash();

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

export const translateFn = (str, ctx) => translations[str] || str;

export function _t(source) {
    return translateFn(source, odoo.translationContext);
}
