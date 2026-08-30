import { Component, useProps, t } from "@odoo/owl";
import { GalleryModel } from "./gallery_model";
import { GalleryImage } from "./gallery_image";

export class GalleryRenderer extends Component {
    static template = "awesome_gallery.GalleryRenderer";
    static components = { GalleryImage };
    props = useProps({
        model: t.instanceOf(GalleryModel),
        onImageUpload: t.function(),
    });
}
