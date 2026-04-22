import { Registry } from "@expense_tracker/owl";

export const screensRegistry = new Registry({
    name: "screens",
    // validation: t.object({
    //     name: t.string(),
    //     icon: t.string(),
    //     window: t.constructor(Component),
    //     "width?": t.number(),
    //     "height?": t.number(),
    // }),
});
