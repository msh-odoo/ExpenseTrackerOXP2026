import { EventBus, Plugin } from "@odoo/owl";

export class BusPlugin extends Plugin {
    bus = new EventBus();
}
