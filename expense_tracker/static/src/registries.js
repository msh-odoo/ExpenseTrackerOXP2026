import { Component, Registry, t } from "@expense_tracker/owl";

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/registries.html
export const screensRegistry = new Registry({
    name: "screens",
    validation: t.constructor(Component),
});
