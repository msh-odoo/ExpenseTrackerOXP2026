import { after, expect, test, describe } from "@odoo/hoot";
import { MainComponentsContainer } from "@web/core/main_components_container";
import { Component, xml, providePlugins } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import {
    defineModels,
    fields,
    models,
    onRpc,
    makeMockEnv,
} from "@web/../tests/web_test_helpers";
import { contains, mountWithCleanup } from "@web/../tests/web_test_helpers";

// import { EventBus } from "@odoo/owl";
import { getTemplate } from "@web/core/templates";

import { DialogPlugin } from "../src/core/dialog/dialog_plugin";
import { HotkeyPlugin } from "../src/plugins/hotkey_plugin";
import { ORMPlugin } from "../src/plugins/orm_plugin";
import { BusPlugin } from "../src/plugins/bus_plugin";
import { ScreenManagerPlugin } from "../src/plugins/screen_manager_plugin"

import { Dashboard } from "./../src/screens/expense_dashboard/expense_dashboard";

// patch(MainComponentsContainer.prototype, {
//     setup() {
//         super.setup();

//         hasMainComponent = true;
//         after(() => (hasMainComponent = false));
//     },
// });

// let hasMainComponent = false;

// async function makeMockedEnv() {
//     const bus = new EventBus();
//     const db = new DB();
//     const datetime = new Date();
//     const options = { bus, db, rpc, datetime };
//     const env = await makeMockEnv(options);
//     return env;
// }

// async function mountWithCleanup(ComponentClass, options) {
//     const config = {
//         getTemplate,
//         plugins: [DialogPlugin, HotkeyPlugin, ORMPlugin, ScreenManagerPlugin, BusPlugin],
//         name: ComponentClass.constructor.name,
//         translateFn: () => {},
//     };

//     // getFixture().classList.add("o_web_client");

//     /** @type {InstanceType<C>} */
//     const component = await mountOnFixture(ComponentClass, config, options?.target);
//     if (!options?.noMainContainer && !hasMainComponent) {
//         await mountOnFixture(MainComponentsContainer, { ...config, props: {} });
//     }

//     return component;
// }

class ResUsers extends models.Model {
    _name = "res.users";

    name = fields.Char();
}

class ExpenseCategory extends models.Model {
    _name = "expense.category";

    name = fields.Char();
}

class PaymentMethod extends models.Model {
    _name = "payment.method";

    name = fields.Char();
}

class ExpenseTag extends models.Model {
    _name = "expense.tag";

    name = fields.Char();
}

class PersonalExpense extends models.Model {
    _name = "personal.expense";

    name = fields.Char();
    user_id = fields.Many2one({relation: "res.users"});
    date = fields.Date()
    amount = fields.Float()
    category_id = fields.Many2one({relation: "expense.category"})
    icon = fields.Char()
    payment_method_id = fields.Many2one({relation: "payment.method"})
    tag_ids = fields.Many2many({ string: "Companies", relation: "expense.tag" });
}

defineModels([PersonalExpense, ResUsers, ExpenseCategory, PaymentMethod, ExpenseTag]);


describe.current.tags("expense");

test("dashboard can be rendered", async () => {
    onRpc("personal.expense", "search_read", ({ args, kwargs }) => {
        return [
            {
                id: 1,
                name: "Expense 1",
                user_id: 1,
                date: "2022-01-01",
                amount: 100.0,
                category_id: 1,
                icon: "icon1",
                payment_method_id: 1,
                tag_ids: [1],
            },
        ];
    });

    class MyComponent extends Component {
        static props = {};
        static template = xml`<Dashboard />`;
        static components = { Dashboard };

        setup() {
            providePlugins([BusPlugin, DialogPlugin, HotkeyPlugin, ORMPlugin, ScreenManagerPlugin]);
        }
    }
    await mountWithCleanup(MyComponent, {});

    expect(`.o_dashboard`).toHaveCount(1);
});
