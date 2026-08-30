import { Component, useProps, t } from "@odoo/owl";
import { url } from "@web/core/utils/urls";
import { GalleryModel } from "./gallery_model";
import { useService } from "@web/core/utils/hooks";
import { FileUploader } from "@web/views/fields/file_handler";

export class GalleryImage extends Component {
    static template = "awesome_gallery.GalleryImage";
    static components = { FileUploader }
    props = useProps({
        record: t.object(),
        model: t.instanceOf(GalleryModel),
        onImageUpload: t.function(),
    });

    setup() {
        this.action = useService("action");
        this._onFileUploadedBounded = this._onFileUploaded.bind(this);
    }

    onImageClick(resId) {
        this.action.switchView("form", { resId });
    }

    get imageUrl() {
        return url("/web/image", {
            model: this.props.model.resModel,
            id: this.props.record.id,
            field: this.props.model.imageField,
            unique: this.props.record.write_date,
        });
    }

    async _onFileUploaded({ data }) {
        await this.props.onImageUpload(this.props.record.id, data);
    }
}
