import { registry } from "@web/core/registry";
import { GalleryController } from "./gallery_controller";
import { GalleryArchParser } from "./gallery_arch_parser";

export const galleryView = {
    type: "gallery",
    Controller: GalleryController,
    ArchParser: GalleryArchParser,

    props(genericProps, view) {
        const { ArchParser } = view;
        const { arch } = genericProps;
        const archInfo = new ArchParser().parse(arch);

        return {
            ...genericProps,
            archInfo,
        };
    },
};

registry.category("views").add("gallery", galleryView);
