import { EventBus, Plugin } from "@expense_tracker/owl";

export class BusPlugin extends Plugin {
    bus = new EventBus();
}
