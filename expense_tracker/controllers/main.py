from odoo import http
from odoo.http import request, route
from odoo.exceptions import AccessError
from odoo.tools.misc import hmac

class ExpenseTracker(http.Controller):

    @http.route(['/expense_tracker'], type='http', auth='user')
    def expense_tracker(self, **kwargs):
        """
        Renders the owl ecommerce page
        """
        # Side-effect, refresh the session lifetime
        request.session.touch()

        # Restore the user on the environment, it was lost due to auth="none"
        request.update_env(user=request.session.uid)
        try:
            if request.env.user:
                request.env.user._on_webclient_bootstrap()
            context = request.env['ir.http'].webclient_rendering_context()

            # Add the browser_cache_secret here and not in session_info() to ensure that it is only in
            # the webclient page, which is cache-control: "no-store" (see below)
            # Reuse session security related fields, to change the key when a security event
            # occurs for the user, like a password or 2FA change.
            hmac_payload = request.env.user._session_token_get_values()  # already ordered
            session_info = context.get("session_info")
            session_info['browser_cache_secret'] = hmac(request.env(su=True), "browser_cache_key", hmac_payload)

            response = request.render('expense_tracker.root', qcontext=context)
            response.headers['X-Frame-Options'] = 'DENY'
            response.headers['Cache-Control'] = 'no-store'
            return response
        except AccessError:
            return request.redirect('/web/login?error=access')
