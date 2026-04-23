{
    'name': 'Personal Expense Tracker',
    'version': '1.0',
    'summary': 'Track personal expenses',
    'category': 'Tools',
    'author': 'Mohammed Shekha',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'data/expense_payment_method_data.xml',
        'views/expense_views.xml',
        'views/expense_tracker_templates.xml',
    ],
    'demo': [
        'data/expense_category_demo.xml',
        'data/expense_demo.xml',
    ],
    'assets': {
        # 'web.assets_backend': [
        #     'expense_tracker/static/src/backend/**/*',
        # ],
        'expense_tracker.assets_expense': [
            'web/static/src/scss/functions.scss',
            'web/static/src/scss/utils.scss',
            ('include', 'web._assets_primary_variables'),
            ('include', 'web._assets_secondary_variables'),

            # Odoo scss variables and mixins
            ('include', 'web._assets_helpers'),
            ('include', 'web._assets_frontend_helpers'),
            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            'web/static/lib/bootstrap/scss/_variables-dark.scss',
            'web/static/lib/bootstrap/scss/_maps.scss',
            # Bootstrap frontend styles (buttons, form controls, dropdowns, modals, ...)
            ('include', 'web._assets_bootstrap_frontend'),
            # Odoo icons and fonts
            ('include', 'web.icons_fonts'),

            'expense_tracker/static/lib/module_loader.js',
            'expense_tracker/static/lib/owl.js',
            'expense_tracker/static/lib/odoo_module.js',
            'expense_tracker/static/src/**/*',
        ],
        # Assets for test framework and setup
        'expense_tracker.assets_unit_tests_setup': [
            'web/static/src/module_loader.js',

            'expense_tracker/static/lib/**/*',

            'web/static/lib/hoot/**/*',
            'web/static/lib/hoot-dom/**/*',
            ('remove', 'web/static/lib/hoot/tests/**/*'),

            # Odoo mocks
            # ! must be loaded before other @web assets
            'web/static/tests/_framework/mock_module_loader.js',

            # Assets for features to test (views, services, fields, ...)
            # Typically includes most files in 'web.web.assets_backend'
            ('include', 'web.assets_backend'),
            ('include', 'web.assets_backend_lazy'),
            'expense_tracker/static/src/**/*',

            'web/static/src/public/public_component_service.js',
            'web/static/src/webclient/clickbot/clickbot.js',
        ],
        # Unit test files
        'expense_tracker.assets_unit_tests': [
            # 'web/static/tests/**/*',
            'web/static/tests/_framework/**/*',
            'web/static/tests/web_test_helpers.js',
            'expense_tracker/static/tests/**/*',

            ('remove', 'web/static/tests/_framework/mock_module_loader.js'),
            # ('remove', 'web/static/tests/legacy/**/*'), # to remove when all legacy tests are ported
        ],
    },
    'installable': True,
    'application': True,
}
