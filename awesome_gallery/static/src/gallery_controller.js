import { Component, asyncComputed, onWillStart, proxy, signal, useProps, t } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { standardViewProps } from "@web/views/standard_view_props";
import { useService } from "@web/core/utils/hooks";
import { KeepLast } from "@web/core/utils/concurrency";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };
    props = useProps({
        ...standardViewProps,
        archInfo: t.object(),
    });


    setup() {
        this.orm = useService("orm");
        this.images = proxy({ data: [] });
        this.keeplast = new KeepLast();
        this.domain = signal(this.props.domain);
        onWillStart(async () => {
            const { records } = await this.loadImages(this.domain());
            this.images.data = records;
        });

        asyncComputed(async () => {
            const { records } = await this.loadImages(this.domain());
            this.images.data = records;
        });
    }

    loadImages(domain) {
        return this.keeplast.add(
            this.orm.webSearchRead(this.props.resModel, domain, {
                limit: this.props.archInfo.limit,
                specification: {
                    [this.props.archInfo.imageField]: {},
                },
                context: {
                    bin_size: true,
                }
            })
        );
    }
}
