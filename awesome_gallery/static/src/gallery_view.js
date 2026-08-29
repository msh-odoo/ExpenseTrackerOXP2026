import { registry } from "@web/core/registry";
import { GalleryController } from "./gallery_controller";

export const galleryView = {
    type: "gallery",
    Controller: GalleryController,
};

registry.category("views").add("gallery", galleryView);
