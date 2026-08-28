import { Component, Registry, t } from "@odoo/owl";

export const screensRegistry = new Registry({
    name: "screens",
    validation: t.constructor(Component),
});
