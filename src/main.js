import Vue from "vue"
import App from "./App.vue"
import VueRouter from "vue-router";
import router from "./router/routes"
import vuetify from "./vuetify"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios";
import VueCookie from "vue-cookie"
import images from "./images"

import Notifications from "@/components/Notifications";

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

new Vue({
    el: '#app',
    data: () => ({
        images
    }),
    store,
    render: h => h(App),
    router,
    vuetify
})
