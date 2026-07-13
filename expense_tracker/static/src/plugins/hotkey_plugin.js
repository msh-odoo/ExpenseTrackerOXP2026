import { Plugin, Resource, useListener } from "@expense_tracker/owl";
import { isMacOS } from "@expense_tracker/core/utils";

const ALPHANUM_KEYS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
const NAV_KEYS = [
    "arrowleft",
    "arrowright",
    "arrowup",
    "arrowdown",
    "pageup",
    "pagedown",
    "home",
    "end",
    "backspace",
    "enter",
    "tab",
    "delete",
    "space",
];
const MODIFIERS = ["alt", "control", "shift"];
const AUTHORIZED_KEYS = [...ALPHANUM_KEYS, ...NAV_KEYS, "escape", "<", ">"];

/**
 * Get the actual hotkey being pressed.
 *
 * @param {KeyboardEvent} ev
 * @returns {string} the active hotkey, in lowercase
 */
export function getActiveHotkey(ev) {
    if (!ev.key) {
        // Chrome may trigger incomplete keydown events under certain circumstances.
        // E.g. when using browser built-in autocomplete on an input.
        // See https://stackoverflow.com/questions/59534586/google-chrome-fires-keydown-event-when-form-autocomplete
        return "";
    }
    if (ev.isComposing) {
        // This case happens with an IME for example: we let it handle all key events.
        return "";
    }
    const hotkey = [];

    // ------- Modifiers -------
    // Modifiers are pushed in ascending order to the hotkey.
    if (isMacOS() ? ev.ctrlKey : ev.altKey) {
        hotkey.push("alt");
    }
    if (isMacOS() ? ev.metaKey : ev.ctrlKey) {
        hotkey.push("control");
    }
    if (ev.shiftKey) {
        hotkey.push("shift");
    }

    // ------- Key -------
    let key = ev.key.toLowerCase();

    // The browser space is natively " ", we want "space" for esthetic reasons
    if (key === " ") {
        key = "space";
    }

    // Identify if the user has tapped on the number keys above the text keys.
    if (ev.code && ev.code.indexOf("Digit") === 0) {
        key = ev.code.slice(-1);
    }
    // Prefer physical keys for non-latin keyboard layout.
    if (!AUTHORIZED_KEYS.includes(key) && ev.code && ev.code.indexOf("Key") === 0) {
        key = ev.code.slice(-1).toLowerCase();
    }
    // Make sure we do not duplicate a modifier key
    if (!MODIFIERS.includes(key)) {
        hotkey.push(key);
    }

    return hotkey.join("+");
}

export class HotkeyPlugin extends Plugin {
    setup() {
        this.hotkeyResource = new Resource({ name: "shortcuts" });
        useListener(window, "keydown", this.onKeydown.bind(this));
    }
    /**
     * Handler for keydown events.
     * Verifies if the keyboard event can be dispatched or not.
     * Rules sequence to forbid dispatching :
     * - UI is blocked
     * - the pressed key is not whitelisted
     *
     * @param {KeyboardEvent} event
     */
    onKeydown(event) {
        if (event.code && event.code.indexOf("Numpad") === 0 && /^\d$/.test(event.key)) {
            // Ignore all number keys from the Keypad because of a certain input method
            // of (advance-)ASCII characters on Windows OS: ALT+[numerical code from keypad]
            // See https://support.microsoft.com/en-us/office/insert-ascii-or-unicode-latin-based-symbols-and-characters-d13f58d3-7bcb-44a7-a4d5-972ee12e50e0#bm1
            return;
        }

        const hotkey = getActiveHotkey(event);
        if (!hotkey) {
            return;
        }

        const dispatched = this.dispatchHotkey(hotkey);
        if (dispatched) {
            // Only if event has been handled.
            // Purpose: prevent browser defaults
            event.preventDefault();
            // Purpose: stop other window keydown listeners (e.g. home menu)
            event.stopImmediatePropagation();
        }
    }
    addHotkey(hotkey, action) {
        this.hotkeyResource.add({ key: hotkey, action });
    }
    /**
     * Dispatches an hotkey to first matching registration.
     * Registrations are iterated in following order:
     * - priority to all registrations done through the hotkeyService.add()
     *   method (NB: in descending order of insertion = newer first)
     * - then all registrations done through the DOM [data-hotkey] attribute
     *
     * @param {{
     *  activeElement: HTMLElement,
     *  hotkey: string,
     *  isRepeated: boolean,
     *  target: EventTarget,
     *  shouldProtectEditable: boolean,
     * }} infos
     * @returns {boolean} true if has been dispatched
     */
    dispatchHotkey(key) {
        // TODO: MSH: note that hotkey is not the right example because here we store key-value pairs,
        // better example would be where we have to store list of items only, because resource is ordered collection of items
        const items = this.hotkeyResource.items();
        const hotkey = items.find((item) => item.key === key);
        if (hotkey) {
            hotkey.action();
            return true;
        }
        return false;
    }
    showHotkeys() {
        const shortcuts = this.hotkeyResource.getAll();
        console.table(shortcuts);
    }
}
