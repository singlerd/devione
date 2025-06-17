define([
    'Magento_Checkout/js/view/payment/default',
    'jquery',
    'ko'
], function (Component, $, ko) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'DS_CustomPayment/payment/simple',
            convertedAmount: ko.observable(null),
            convertedCurrency: ko.observable(null)
        },

        initialize: function () {
            this._super();
            this.fetchConvertedAmount();
        },

        fetchConvertedAmount: function () {
            var self = this;

            $.get('/custompayment/checkout/calculate', function (data) {
                if (data.converted !== undefined) {
                    self.convertedAmount(data.converted);
                    self.convertedCurrency(data.currency);
                }
            }).fail(function () {
                console.error('Failed to call calculate controller');
            });
        },

        getConvertedAmount: function () {
            return this.convertedAmount();
        },

        getConvertedCurrency: function () {
            return this.convertedCurrency();
        }
    });
});
