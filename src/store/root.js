import Vue from "vue";

export default {
    state: () => ({
        loading: false,
        progress: 0,
        notifications: [],
        access_token: null,
        user: null
    }),
    mutations: {
        setTokens(state, payload) {
            state.access_token = payload.token_type + ' ' + payload.access_token;

            Vue.cookie.set('refresh_token', payload.refresh_token, {'max-age': payload.expires_in, 'secure': true, 'SameSite': 'strict'});

            // Добавляем интерсептор с ключем, чтобы не прописывать его в каждом запросе
            Vue.axios.interceptors.request.use(config => {
                config.headers.Authorization =  state.access_token;
                config.headers['Content-Type'] = 'application/json';
                config.headers.Accept = 'application/json';
                console.log('Сработал интерсептор request', config);
                return config;
            },null, { synchronous: true })

            // Добавляем интерсептор ответа, чтобы предпринять действия в случае разлогинивания
            Vue.axios.interceptors.response.use(res => res, err => {
                console.log('Сработал интерсептор response', err);

                return Promise.reject(err);
            })
        },
        setProgress(state, payload) {
            state.progress = payload;
        },
        setLoading(state, payload) {
            state.loading = payload;
        },
        setError(state, payload) {
            console.error(payload);
            if (Object.prototype.hasOwnProperty.call(payload, "status"))
                this.commit('setNotification', {value: window.ErrorsMes[payload.status], color: 'error'}, {root: true});
            else
                this.commit('setNotification', {value: window.ErrorsMes.UNKNOWN_ERROR, color: 'error'}, {root: true});
        },
        setNotification(state, payload) {
            state.notifications.unshift({time: new Date().getTime(), ...payload});
        },
        clearNotification(state, time) {
            var key = state.notifications.findIndex(item => item.time === time);
            state.notifications.splice(key, 1);
        }
    },
    actions: {},
    getters: {
        getAccessToken(state) {
            return state.access_token;
        },
        progress(state) {
            return state.progress;
        },
        loading(state) {
            return state.loading;
        },
        notifications(state) {
            return state.notifications;
        }
    }
}
