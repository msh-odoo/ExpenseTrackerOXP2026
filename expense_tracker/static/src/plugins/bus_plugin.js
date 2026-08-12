import { EventBus, Plugin } from "@odoo/owl";

// Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/plugins.html
export class BusPlugin extends Plugin {
    bus = new EventBus();
}
