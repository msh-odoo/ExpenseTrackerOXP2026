import { Component, useProps, t } from "@odoo/owl";
import { GalleryModel } from "./gallery_model";

export class GalleryRenderer extends Component {
    static template = "awesome_gallery.GalleryRenderer";
    props = useProps({
        model: t.instanceOf(GalleryModel),
    });
}
