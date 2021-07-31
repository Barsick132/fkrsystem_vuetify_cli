import Vue from "vue";
import {router} from '@/router/routes'
import {User} from "@/store/_helpers/user";

export default {
    namespaced: true,
    state: () => ({
        accesses: null
    }),
    mutations: {
        setAccesses(state, res) {
            if (res.status === "OK" && res.payload) {
                state.accesses = res.payload.accesses;
            } else {
                throw res;
            }
        },
        logout(state) {
            User.removeAuthData();
            state.accesses = null;

            router.push({name: 'login'});
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
                    return status === 400 || status === 200; // Resolve only if the status code is 400 or 200
                }
            })
                .then(async (res) => {
                    if (res.status === 400) {
                        commit('setNotification', {value: 'Не верный логин или пароль', color: 'error'}, {root: true})
                        return;
                    }
                    // Сохраняем данные авторизации в localStorage
                    User.saveAuthData({...res.data, remember_me: auth_data.remember_me});
                    // Запрашиваем доступы для дальнейшей работы
                    return dispatch('requestGetAccesses');
                })
                .then(() => {
                    // Перебрасываем пользователя на главную страницу
                    router.push({name: 'home'});
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
                .finally(() => {
                    commit('setLoading', false, {root: true})
                })
        },
        requestRefreshToken({commit, dispatch}) {
            let auth_data = {
                grant_type: 'refresh_token',
                refresh_token: User.refreshToken.get(),
                client_id: process.env.VUE_APP_CLIENT_ID,
                client_secret: process.env.VUE_APP_CLIENT_SECRET,
                scope: '*',
            };

            return new Promise((resolve, reject) => {
                if (!auth_data.refresh_token) {
                    reject();
                }

                Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'oauth/token', auth_data, {
                    validateStatus(status) {
                        return status === 401 || status === 200;
                    }
                })
                    .then(res => {
                        // Так как в случае невалидности refresh_token возникает ошибка 401
                        // необходимо обработать ее в методе, чтобы не возникало рекурсии в интерсепторе
                        if (res.status === 401)
                            throw res;

                        // Сохраняем данные авторизации в localStorage
                        User.saveAuthData(res.data);
                        // Запрашиваем доступы для дальнейшей работы
                        return dispatch('requestGetAccesses');
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        commit('logout')
                        reject();
                    });
            })
        },
        requestGetAccesses({commit}) {
            return Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getAccesses')
                .then(res => {
                    // Сохраняем доступы
                    commit('setAccesses', res.data);
                })
                .catch((err) => {
                    throw err;
                })
        },
    },
    getters: {
        getAccesses(state) {
            return state.accesses;
        },
    }
}
