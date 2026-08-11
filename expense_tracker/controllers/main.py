from odoo import http
from odoo.http import request

class ExpenseTracker(http.Controller):

    @http.route(['/expense_tracker'], type='http', auth='user')
    def expense_tracker(self, **kwargs):
        """
        Renders the owl ecommerce page
        """
        session_info = self.env["ir.http"].session_info()
        return request.render('expense_tracker.root', {"session_info": session_info})
