import { BaseModel } from "../model/model";

export class ExpenseTrackerModel extends BaseModel {
    /**
     * @override
     */
    setup(params) {
        super.setup(params);
        this.expenses = [];
    }

    /**
     * @param {SearchParams} searchParams
     */
    load_categories(searchParams) {
        return this.orm.searchRead("expense.category", [], ["name", "icon", "description"], {});
    }

    /**
     * @param {SearchParams} searchParams
     */
    load_tags(searchParams) {
        return this.orm.searchRead("expense.tag", [], ["name", "color"], {});
    }

    /**
     * @param {Object} params
     */
    load_expense_form_data(params) {
        return this.rpc(`/expense/get_expense_form_data/${params.model}/${params.id || ""}`, {
            isNew: params.isNew,
            fields: params.fields,
        });
    }

    /**
     * @param {Object} params
     */
    load_data(params) {
        return this.rpc(`/expense/get_form_data/${params.model}/${params.id || ""}`, {
            isNew: params.isNew,
            fields: params.fields,
        });
    }

    /**
     * @param {SearchParams} searchParams
     */
    load_expenses(searchParams) {
        return this.orm.searchRead(
            "personal.expense",
            [["active", "=", true]],
            [
                "name",
                "user_id",
                "date",
                "amount",
                "category_id",
                "icon",
                "payment_method_id",
                "tag_ids",
            ],
            { limit: 20 },
        );
    }

    /**
     * @param {Integer} categoryId
     */
    load_category_expenses(categoryId) {
        if (!categoryId) {
            return [];
        }
        const domain = [];
        if (categoryId !== "all") {
            domain.push(["category_id", "=", categoryId]);
        }
        return this.orm.searchRead(
            "personal.expense",
            domain,
            [
                "name",
                "user_id",
                "date",
                "amount",
                "category_id",
                "icon",
                "payment_method_id",
                "tag_ids",
            ],
            { limit: 20 },
        );
    }

    /**
     * @override
     */
    hasData() {
        return this.data.some((data) => data.rows.length > 0);
    }
}
