from odoo import api, models, fields, _


class AccountStatement(models.Model):
    _inherit = 'account.bank.statement.line'

    @api.model
    def button_call_undo_recoil(self, res_ids):
        search_lines = self.env['account.bank.statement.line'].search([('id', 'in', res_ids)])
        for lines in search_lines:
            lines.button_undo_reconciliation()
        return True