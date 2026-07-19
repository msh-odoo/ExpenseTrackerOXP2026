import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { useModelWithSampleData } from "@web/model/model";
import { Component, onWillStart, proxy, signal, useEffect, useProps } from "@odoo/owl";
import { standardViewProps } from "@web/views/standard_view_props";
import { usePager } from "@web/search/pager_hook";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static props = {
        ...standardViewProps,
        archInfo: Object,
        Model: Function,
        Renderer: Function,
    };
    static components = { Layout };

    setup() {
        this.model = useModelWithSampleData(
            this.props.Model,
            this.props.modelParams,
            this.modelOptions,
        );
        this.domain = signal(this.props.domain);

        usePager(() => ({
            offset: this.model.pager.offset,
            limit: this.model.pager.limit,
            total: this.model.recordsLength,
            onUpdate: async ({ offset, limit }) => {
                this.model.pager.offset = offset;
                this.model.pager.limit = limit;
                await this.model.load(this.props.domain);
            },
        }));
    }

    async onImageUpload(record_id, image_binary) {
        this.model.uploadImage(record_id, image_binary, this.props.domain);
    }
}
