import Vue from "vue"
import App from "./App.vue"
import VueRouter from "vue-router";
import {router} from "./router/routes"
import vuetify from "./vuetify"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios";
import VueCookie from "vue-cookie"
import images from "./images"

import {filterBeautifulDtLocalFromISO, filterDtLocalFromISO, filterMoney} from '@/store/_helpers/date_helpers'

import Notifications from "@/components/Notifications";
import AppBarNavLogo from "@/components/AppBarNavLogo";

import './errors'
import "./styles/main.sass"

// Плагин для маршрутизации
Vue.use(VueRouter)
// Плагин для построения запросов
Vue.use(VueAxios, axios)
// Плагин для работы с cookies
Vue.use(VueCookie)

Vue.config.productionTip = false

Vue.component('Notifications', Notifications);
Vue.component('AppBarNavLogo', AppBarNavLogo);

Vue.filter('filterMoney', filterMoney);
Vue.filter('filterDtLocalFromISO', filterDtLocalFromISO);
Vue.filter('filterBeautifulDtLocalFromISO', filterBeautifulDtLocalFromISO);

new Vue({
    el: '#app',
    data: () => ({
        images
    }),
    store,
    render: h => h(App),
    router,
    vuetify,
    methods: {
        getIconNameByExtension(file_extension) {
            switch (file_extension) {
                case 'pdf':
                    return 'mdi-file-pdf';
                case 'xls':
                case 'xlsx':
                case 'xml':
                    return 'mdi-file-excel';
                case 'doc':
                case 'docx':
                    return 'mdi-file-word';
                case 'jpeg':
                case 'jpg':
                case 'png' :
                case 'gif':
                    return 'mdi-file-image';
                case 'zip':
                case 'rar':
                    return 'mdi-archive';
                default:
                    return 'mdi-file';
            }
        },
    }
})
