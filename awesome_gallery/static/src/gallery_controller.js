import { Component, asyncComputed, onWillStart, proxy, signal, useProps, t } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { standardViewProps } from "@web/views/standard_view_props";
import { useService } from "@web/core/utils/hooks";
import { GalleryModel } from "./gallery_model";
import { GalleryRenderer } from "./gallery_renderer";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout, GalleryRenderer };
    props = useProps({
        ...standardViewProps,
        archInfo: t.object(),
    });


    setup() {
        this.orm = useService("orm");
        this.model = proxy(
            new GalleryModel(
                this.orm,
                this.props.resModel,
                this.props.archInfo,
            )
        );
        this.domain = signal(this.props.domain);
        const loadProm = asyncComputed(async () => {
            await this.model.load(this.domain());
        });

        onWillStart(async () => {
            return loadProm.currentPromise();
        });
    }

}
