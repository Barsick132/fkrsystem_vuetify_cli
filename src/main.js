import Vue from "vue"
import App from "./App.vue"
import VueRouter from "vue-router";
import router from "./routes"
import vuetify from "./vuetify"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios";
import "./styles/main.sass"


// Библиотека для маршрутизации
Vue.use(VueRouter)
// Библиотека для построения запросов
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router,
  vuetify
})
