import Vue from "vue";
// import router from './../../router/routes'

export default {
    namespaced: true,
    state: () => ({}),
    mutations: {},
    actions: {
        requestLogin({ commit, dispatch }, auth_data) {
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
                .then(res => {
                    if (res.status === 400) {
                        commit('setNotification', {value: 'Не верный логин или пароль', color: 'error'}, {root: true})
                        return;
                    }
                    // Сохраняем access_token в root, а refresh_token в cookies
                    commit('setTokens', res.data, {root: true});
                    // Запрашиваем данные пользователя для дальнейшей работы
                    dispatch('requestGetUser');
                    // Перебрасываем пользователя на главную страницу
                    // router.push('/home');
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
                .finally(() => {
                    commit('setLoading', false, {root: true})
                })
        },
        async requestGetUser() {
            let res = await Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getAccesses');

            console.log(res);
        }
    },
    getters: {}
}
