import textwrap

from odoo.addons.base.models.assetsbundle import AssetsBundle

originalMethod = AssetsBundle.js

def js(self):
    if self.name != "expense_tracker.assets_expense":
        return originalMethod(self)

    is_minified = not self.is_debug_assets
    extension = 'min.js' if is_minified else 'js'
    js_attachment = self.get_attachments(extension)

    if not js_attachment:
        template_bundle = ''
        if self.templates:
            templates = self.generate_xml_bundle()
            template_bundle = textwrap.dedent(f"""

                /*******************************************
                *  Templates                               *
                *******************************************/

                odoo.define("{self.name}.bundle.xml", ["@expense_tracker/core/templates"], function(require) {{
                    "use strict";
                    const {{ checkPrimaryTemplateParents, registerTemplate, registerTemplateExtension }} = require("@expense_tracker/core/templates");
                    /* {self.name} */
                    {templates}
                }});
            """)

        if is_minified:
            content_bundle = ';\n'.join(asset.minify() for asset in self.javascripts)
            content_bundle += template_bundle
            js_attachment = self.save_attachment(extension, content_bundle)
        else:
            js_attachment = self.js_with_sourcemap(template_bundle=template_bundle)

    return js_attachment[0]

AssetsBundle.js = js