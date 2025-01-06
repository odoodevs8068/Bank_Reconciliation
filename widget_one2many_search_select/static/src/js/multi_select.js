odoo.define('widget_one2many_search_select.multi_select_search', function (require) {
    "use strict";

    var core = require('web.core');
    var rpc = require('web.rpc');
    var fieldRegistry = require('web.field_registry');
    var relationalFields = require('web.relational_fields');
    var ListRenderer = require('web.ListRenderer');
    var _t = core._t;

    var CustomListRenderer = ListRenderer.extend({
        init: function (parent, state, params) {
            this._super.apply(this, arguments);
            this.hasSelectors = true;
        },

        _updateSelection: function () {
            this.selection = [];
            var self = this;

            var $inputs = this.$('tbody .o_list_record_selector input:visible:not(:disabled)');
            var allChecked = $inputs.length > 0;

            $inputs.each(function (index, input) {
                if (input.checked) {
                    var $row = $(input).closest('tr');
                    var record = self.state.data[$row.index()];
                    if (record && record.res_id) {
                        self.selection.push(record.res_id);
                    }
                } else {
                    allChecked = false;
                }
            });

            if (this.selection.length > 0) {
                $('.revert_recoil').show();
            } else {
                $('.revert_recoil').hide();
            }

            this.$('thead .o_list_record_selector input').prop('checked', allChecked);
            this.trigger_up('selection_changed', {
                selection: this.selection
            });
            this._updateFooter();
        },
    });

    var One2ManySearchWidget = relationalFields.FieldOne2Many.extend({
        template: 'One2ManySearch',
        events: _.extend({}, relationalFields.FieldOne2Many.prototype.events, {
            'keyup .oe_search_value': '_onKeyUp',
            'click .revert_recoil': 'RevertRecoil',
        }),

        _getRenderer: function () {
            if (this.view.arch.tag === 'tree') {
                return CustomListRenderer;
            }
            return this._super.apply(this, arguments);
        },

        RevertRecoil: function () {
            var self = this;
            var selectedIds = self.renderer.selection || [];
            if (selectedIds.length === 0) {
                self.displayNotification({
                    type: 'danger',
                    title: _t('Warning'),
                    message: "No records selected.",
                });
                return;
            }

            rpc.query({
                model: 'account.bank.statement.line',
                method: 'button_call_undo_recoil',
                args: [selectedIds],
            }).then(function (result) {
                self.displayNotification({
                    type: result ? 'success' : 'danger',
                    title: _t(result ? 'Success' : 'Error'),
                    message: result ? "Undo reconciliation completed successfully." : "Undo reconciliation failed.",
                });
            }).catch(function () {
                self.displayNotification({
                    type: 'danger',
                    title: _t('Error'),
                    message: "An error occurred while undoing the reconciliation.",
                });
            });
        },

        _onKeyUp: function (event) {
            var self = this;
            self.$el.find('table').addClass('oe_one2many');
            var value = $(event.currentTarget).val().toLowerCase();
            var $el = $(this.$el)
            $(".oe_one2many tr:not(:lt(1))").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        },
    });

    fieldRegistry.add('one2many_search_select', One2ManySearchWidget);
});
