import { GalleryModel } from "@awesome_gallery/gallery_model";
import { patch } from "@web/core/utils/patch";


patch(GalleryModel.prototype, {
    defineOtherProperties(orm, resModel, fields, archInfo) {
        super.defineOtherProperties(orm, resModel, fields, archInfo);
        const { previewImage } = archInfo;
        this.previewImage = previewImage;
    }
});
