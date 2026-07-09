from odoo import api, models, fields
from odoo.exceptions import ValidationError

class ExpenseTag(models.Model):
    _name = 'expense.tag'
    _description = 'Expense Tags'

    name = fields.Char(string='Tag Name', required=True)
    color = fields.Integer(string='Color Index')

    @api.model
    def search_read(self, domain=None, fields=None, offset=0, limit=None, order=None, **read_kwargs):
        if domain is None:
            domain = []
        # raise ValidationError("search_read method is not allowed for ExpenseTag model.")
        return super(ExpenseTag, self).search_read(domain=domain, fields=fields, offset=offset, limit=limit, order=order)
