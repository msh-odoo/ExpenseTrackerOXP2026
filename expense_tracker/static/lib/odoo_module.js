odoo.define("@expense_tracker/owl", [], function () {
    "use strict";

    const owl = globalThis.owl;
    return owl;
});

// This idea here is to replace/rename @web/core/templates with @expense_tracker/core/templates
// So that when assetsbundle calls registerTemplate of @web/core/templates,
// it will actually call the one of @expense_tracker/core/templates where we can do what we want with it (like storing templates in a variable for tests for example)
// instead of monkey patching AssetsBundle class in python

// odoo.define("@web/core/templates", ["@expense_tracker/core/templates"], function () {
//     "use strict";
//     templates = require("@expense_tracker/core/templates");

//     return templates;
// });
