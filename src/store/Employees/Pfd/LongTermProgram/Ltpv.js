import Vue from "vue";

export default {
    namespaced: true,
    state: () => ({
        mkds: null
    }),
    mutations: {
        setMkds(state, payload) {
            if (payload && payload.mkd_arr)
                payload.mkd_arr.forEach(mkd => {
                    mkd.stp_arr.forEach(stp => {
                        if (stp.opened === undefined)
                            stp.opened = false;
                    })
                })
            state.mkds = payload;
        }
    },
    actions: {
        requestGetMkdInLtpV({commit}, body) {
            commit('setLoading', true, {root: true})
            commit('setProgress', 0, {root: true})
            commit('setMkds', null);

            console.log(body);
            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/getMkdInLtpV', body, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 50)

                    commit('setProgress', uploadProgress, {root: true})
                },
                onDownloadProgress: ({loaded, total}) => {
                    const downloadProgress = Math.round(50 + loaded / total * 50)

                    commit('setProgress', downloadProgress, {root: true})
                }
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload) {
                        commit('setMkds', res.payload);
                    } else {
                        throw res;
                    }
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
                .finally(() => {
                    commit('setLoading', false, {root: true})
                })
        }
    },
    getters: {
        getMkds(state) {
            console.log(state.mkds);
            return state.mkds;
        },
    }
}