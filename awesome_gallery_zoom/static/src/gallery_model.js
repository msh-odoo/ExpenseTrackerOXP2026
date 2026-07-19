import { GalleryModel } from "@awesome_gallery/gallery_model";
import { patch } from "@web/core/utils/patch";


patch(GalleryModel.prototype, {
    setup(params) {
        super.setup(params);
        const { previewImage } = params.archInfo;
        this.previewImage = previewImage;
    }
});
