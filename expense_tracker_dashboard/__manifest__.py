# -*- coding: utf-8 -*-
{
    'name': "Awesome Dashboard",

    'summary': """
        Starting module for "Discover the JS framework, chapter 2: Build a dashboard"
    """,

    'description': """
        Starting module for "Discover the JS framework, chapter 2: Build a dashboard"
    """,

    'website': "https://www.odoo.com/",
    'category': 'Tutorials/AwesomeDashboard',
    'version': '0.1',
    'author': 'Odoo S.A.',
    'application': True,
    'installable': True,
    'depends': ['base', 'web', 'expense_tracker'],

    'data': [
        'views/views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'expense_tracker/static/lib/module_loader.js',
            'expense_tracker/static/lib/owl.js',
            'expense_tracker/static/lib/odoo_module.js',
            'expense_tracker/static/src/core/rpc.js',
            'expense_tracker/static/src/plugins/*',
            'expense_tracker/static/src/registries.js',
            'expense_tracker/static/src/core/utils.js',

            'expense_tracker/static/src/model/*',
            'expense_tracker/static/src/screens/expense_list/*',
            'expense_tracker/static/src/screens/expense_categories/expense_categories.js',
            'expense_tracker/static/src/screens/expense_categories/expense_categories.xml',

            'expense_tracker_dashboard/static/src/**/*',
            ('remove', 'expense_tracker_dashboard/static/src/dashboard/**/*'),
        ],
        'expense_tracker_dashboard.dashboard': [
            'web/static/src/core/lazy_component.js',
            'expense_tracker_dashboard/static/src/dashboard/**/*',
        ]
    },
    'license': 'AGPL-3'
}
