{
    'name': 'Bank Statement Revert reconciliation',
    'version': '1.2',
    'sequence': 1,
    'author': "JD DEVS",
    'depends': ['base', 'account', 'web'],
    'data': [
        'views/views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            "widget_one2many_search_select/static/src/js/multi_select.js",
        ],

        'web.assets_qweb': [
            "widget_one2many_search_select/static/src/xml/one2many_tmpl.xml",
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'images': ['static/description/assets/screenshots/banner.png'],
}
