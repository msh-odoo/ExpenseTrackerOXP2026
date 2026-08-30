import { Component, useProps, t, xml } from "@odoo/owl";
import { GalleryModel } from "./gallery_model";
import { GalleryImage } from "./gallery_image";
import { createElement } from "@web/core/utils/xml";

export class GalleryRenderer extends Component {
    static template = "awesome_gallery.GalleryRenderer";
    static components = { GalleryImage };
    props = useProps({
        model: t.instanceOf(GalleryModel),
        onImageUpload: t.function(),
        tooltipTemplate: t.instanceOf(Element).optional(),
    });

    setup() {
        if (this.props.tooltipTemplate) {
            const fieldsToReplace = this.props.tooltipTemplate.querySelectorAll("field");
            for (const field of fieldsToReplace) {
                const fieldName = field.getAttribute("name")
                const t = document.createElement("t")
                t.setAttribute("t-esc", `record.${fieldName}`)
                field.replaceWith(t);
            }
            const tooltipHTML = createElement("t", [this.props.tooltipTemplate]).outerHTML
            this.owlTooltipTemplate = xml`${tooltipHTML}`
        }
    }
}
