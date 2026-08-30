import { useProps } from "@odoo/owl";
import { GalleryImage } from "@awesome_gallery/gallery_image";
import { patch } from "@web/core/utils/patch";
import { exprToBoolean } from "@web/core/utils/strings";
import { imageUrl } from "@web/core/utils/urls";

function isBinSize(value) {
    return /^\d+(\.\d*)? [^0-9]+$/.test(value);
}

export const fileTypeMagicWordMap = {
    "/": "jpg",
    R: "gif",
    i: "png",
    P: "svg+xml",
    U: "webp",
};
const placeholder = "/web/static/img/placeholder.png";

patch(GalleryImage.prototype, {
    setup() {
        this.props = useProps();
        super.setup();
        this.previewImage = exprToBoolean(this.props.model.previewImage);
    },
    get hasTooltip() {
        return this.previewImage;
    },

    get tooltipAttributes() {
        return {
            template: "awesome_gallery_zoom.ImageZoomTooltip",
            info: JSON.stringify({ url: this.getUrl(this.props.model.imageField) }),
        };
    },

    getUrl(imageFieldName) {
        if (!this.props.record[this.props.model.imageField]) {
            return placeholder;
        }
        this.lastURL = imageUrl(
            this.props.model.resModel,
            this.props.record.id,
            imageFieldName,
            { unique: this.rawCacheKey }
        );
        if (!this.lastURL) {
            // Use magic-word technique for detecting image type
            const magic = fileTypeMagicWordMap[this.props.record[this.props.model.imageField][0]] || "png";
            this.lastURL = `data:image/${magic};base64,${this.props.record[this.props.model.imageField]}`;
        }
        return this.lastURL;
    }
});
