import {User} from "@/store/_helpers/user";
import Vue from "vue";
import store from "@/store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";

// Плагин для маршрутизации
Vue.use(VueRouter)
// Плагин для построения запросов
Vue.use(VueAxios, axios)

// Оотключает предупреждение о работе в режиме разработки при запуске Vue
Vue.config.productionTip = false;

// Установка интерсептора запросов
axios.interceptors.request.use(config => {
    // Устанавливаем заголовки по-умолчанию, если в localStorage есть данные авторизации
    config.headers.Authorization = User.tokenType.get() + ' ' + User.accessToken.get();
    config.headers['Content-Type'] = 'application/json';

    return config;
}, error => error);
// Установка интерсептора запросов ответов
axios.interceptors.response.use(res => res, err => {

    // В случае разлогинивания пытаемся обновить токен
    if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
        return store.dispatch("auth/requestRefreshToken")
            .then(() => {
                err.config.__isRetryRequest = true;
                err.config.headers.Authorization = User.tokenType.get() + ' ' + User.accessToken.get();
                return Vue.axios(err.config);
            })
            .catch(() => {
                throw err.response.data;
            })
    }

    throw err;
})