import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter,
    {
        symbol : '₦',
        thousandsSeparator: ',',
        fractionCount: 2,
        fractionSeparator: '.',
        symbolPosition: 'front',
        symbolSpacing: true
    });