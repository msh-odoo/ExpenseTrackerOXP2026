import { Component, Registry, t } from "@odoo/owl";

export const screensRegistry = new Registry({
    name: "screens",
    validation: t.constructor(Component),
});

export const mainComponentsRegistry = new Registry({
    name: "main_components",
    validation: t.object({
        Component: t.component(),
        props: t.object().optional(),
    }),
});
