import { Model } from "@web/model/model";
import { KeepLast } from "@web/core/utils/concurrency";

export class GalleryModel extends Model {
    setup(params) {
        this.resModel = params.resModel;
        const { imageField, limit, fieldsForTooltip } = params.archInfo;
        this.fieldsForTooltip = fieldsForTooltip;
        this.imageField = imageField;
        this.fields = params.fields;
        this.limit = limit;
        this.keepLast = new KeepLast();
        this.pager = { offset: 0, limit: limit };
        super.setup(params);
        this.data = null;
        this.searchParams = null;
    }

    async load(searchParams) {
        this.searchParams = searchParams;
        const specification = {
            [this.imageField]: {},
            write_date: {},
        };
        for (const field of this.fieldsForTooltip) {
            specification[field] = {};
        }
        const { length, records } = await this.keepLast.add(
            this.orm.webSearchRead(this.resModel, this.searchParams.domain, {
                limit: this.pager.limit,
                offset: this.pager.offset,
                specification,
                context: {
                    bin_size: true,
                },
            }),
        );
        this.recordsLength = length;

        this.records = records;
        this.notify();
    }

    async uploadImage(record_id, image_binary, domain) {
        await this.orm.webSave(
            this.resModel,
            [record_id],
            {
                [this.imageField]: image_binary,
            },
            {
                specification: {},
            },
        );
        await this.load(domain);
    }
}
