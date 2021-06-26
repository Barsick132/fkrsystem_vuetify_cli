import Vue from "vue";
import {router} from '@/router/routes'

export default {
    namespaced: true,
    state: () => ({
        access_token: '',
        accesses: []
    }),
    mutations: {
        setAccesses(state, res) {
            if (res.payload) {
                state.accesses = res.payload.accesses;
            }
            else {
                throw res;
            }
        },
        setTokens(state, payload) {
            // Сохраняем accessToken в state для упрощения доступа
            state.access_token = payload.token_type + ' ' + payload.access_token;

            // Добавляем заголовки по умолчанию
            Vue.axios.defaults.headers.Authorization = state.access_token;
            Vue.axios.defaults.headers['Content-Type'] = 'application/json';

            // Сохраняем refresh_token в cookie
            Vue.cookie.set('refresh_token', payload.refresh_token, {
                'max-age': payload.expires_in,
                'secure': true,
                'SameSite': 'strict'
            });
        },
        logout(state) {
            state.access_token = '';
            state.accesses = [];

            delete Vue.axios.defaults.headers.Authorization;
            delete Vue.axios.defaults.headers['Content-Type'];

            Vue.cookie.delete('refresh_token');

            router.push('/login');
        }
    },
    actions: {
        requestLogin({commit, dispatch}, auth_data) {
            commit('setLoading', true, {root: true})
            commit('setProgress', 0, {root: true})

            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'oauth/token', auth_data, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 50)

                    commit('setProgress', uploadProgress, {root: true})
                },
                onDownloadProgress: ({loaded, total}) => {
                    const downloadProgress = Math.round(50 + loaded / total * 50)

                    commit('setProgress', downloadProgress, {root: true})
                },
                validateStatus: function (status) {
                    return status === 400 || status === 200; // Resolve only if the status code is less than 500
                }
            })
                .then(async (res) => {
                    if (res.status === 400) {
                        commit('setNotification', {value: 'Не верный логин или пароль', color: 'error'}, {root: true})
                        return;
                    }
                    // Сохраняем access_token в root, а refresh_token в cookies
                    commit('setTokens', res.data);
                    // Запрашиваем доступы для дальнейшей работы
                    return dispatch('requestGetAccesses');
                })
                .then(res => {
                    // Сохраняем доступы
                    commit('setAccesses', res.data);

                    // Перебрасываем пользователя на главную страницу
                    router.push('/home');
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
                .finally(() => {
                    commit('setLoading', false, {root: true})
                })
        },
        requestGetAccesses() {
            return Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getAccesses');
        },
        requestRefreshToken({commit, dispatch}) {
            let auth_data = {
                grant_type: 'refresh_token',
                refresh_token: Vue.cookie.get('refresh_token'),
                client_id: process.env.VUE_APP_CLIENT_ID,
                client_secret: process.env.VUE_APP_CLIENT_SECRET,
                scope: '*',
            };

            return new Promise((resolve, reject) => {
                if (!auth_data.refresh_token) {
                    reject();
                }

                Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'oauth/token', auth_data)
                    .then(res => {
                        // Сохраняем access_token в root, а refresh_token в cookies
                        commit('setTokens', res.data);
                        // Запрашиваем доступы для дальнейшей работы
                        return dispatch('requestGetAccesses');
                    })
                    .then(res => {
                        // Сохраняем доступы
                        commit('setAccesses', res.data);
                        resolve();
                    })
                    .catch(() => {
                        commit('setNotification', {value: 'Не удалось обновить токен доступа', color: 'error'}, {root: true})
                        commit('logout')
                        reject();
                    });
            })
        }
    },
    getters: {
        getAccesses(state) {
            return state.accesses;
        },
        getAccessToken(state) {
            return state.access_token;
        },
    }
}
