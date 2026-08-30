import { Component, asyncComputed, onWillStart, proxy, signal, useProps, t } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { standardViewProps } from "@web/views/standard_view_props";
import { useService } from "@web/core/utils/hooks";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };
    props = useProps({
        ...standardViewProps,
        archInfo: t.object(),
        Model: t.function(),
        Renderer: t.function(),
    });


    setup() {
        this.orm = useService("orm");
        this.model = proxy(
            new this.props.Model(
                this.orm,
                this.props.resModel,
                this.props.fields,
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
