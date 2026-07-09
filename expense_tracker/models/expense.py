from odoo import models, fields, api, Command
from odoo.exceptions import ValidationError
class PersonalExpense(models.Model):
    _name = 'personal.expense'
    _description = 'Personal Expense Tracker'

    name = fields.Char(string='Description', required=True)
    active = fields.Boolean(default=True)
    user_id = fields.Many2one("res.users", default=lambda self: self.env.user, required=True)
    date = fields.Date(string='Date', required=True, default=fields.Date.today)
    amount = fields.Float(string='Amount', required=True)
    category_id = fields.Many2one('expense.category', string='Category', required=True)
    icon = fields.Char(related="category_id.icon", string="Icon")
    payment_method_id = fields.Many2one('payment.method', string='Payment Method')
    tag_ids = fields.Many2many('expense.tag', string='Tags')

    @api.model
    def search_read(self, domain=None, fields=None, offset=0, limit=None, order=None, **read_kwargs):
        if domain is None:
            domain = []
        # raise ValidationError("search_read method is not allowed for PersonalExpense model.")
        return super(PersonalExpense, self).search_read(domain=domain, fields=fields, offset=offset, limit=limit, order=order)
