import { Component, useProps } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { standardViewProps } from "@web/views/standard_view_props";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };
    props = useProps({
        ...standardViewProps,
    });
}
