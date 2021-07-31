import {filterBeautifulDtLocalFromISO, filterDtLocalFromISO, filterMoney} from '@/store/_helpers/date_helpers'
import Vue from "vue";

Vue.filter('filterMoney', filterMoney);
Vue.filter('filterDtLocalFromISO', filterDtLocalFromISO);
Vue.filter('filterBeautifulDtLocalFromISO', filterBeautifulDtLocalFromISO);