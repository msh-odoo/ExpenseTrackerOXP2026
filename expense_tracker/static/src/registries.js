import { Component, Registry, t } from "@expense_tracker/owl";

export const screensRegistry = new Registry({
    name: "screens",
    validation: t.constructor(Component),
});
