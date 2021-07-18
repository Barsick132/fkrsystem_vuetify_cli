import Vue from "vue";

export default {
    namespaced: true,
    state: () => ({
        wk_arr: {
            data: [],
            loading: false,
            progress: 0
        },
        mkd_type_arr: {
            data: [],
            loading: false,
            progress: 0
        },
        mas_arr: {
            data: [],
            loading: false,
            progress: 0
        },
    }),
    mutations: {
        setWkArr(state, {
            data = state.wk_arr.data,
            loading = state.wk_arr.loading,
            progress = state.wk_arr.progress
        }) {
            state.wk_arr = {data, loading, progress}
        },
        setMkdTypeArr(state, {
            data = state.mkd_type_arr.data,
            loading = state.mkd_type_arr.loading,
            progress = state.mkd_type_arr.progress
        }) {
            state.mkd_type_arr = {data, loading, progress}
        },
        setMasArr(state, {
            data = state.mas_arr.data,
            loading = state.mas_arr.loading,
            progress = state.mas_arr.progress
        }) {
            state.mas_arr = {data, loading, progress}
        },
    },
    actions: {
        requestGetWkArr({commit}) {
            commit('setWkArr', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getWorkKinds', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setWkArr', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setWkArr', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setWkArr', {loading: false});
                });
        },
        requestGetMkdType({commit}) {
            commit('setMkdTypeArr', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getMkdType', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setMkdTypeArr', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setMkdTypeArr', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setMkdTypeArr', {loading: false});
                });
        },
        requestGetMkdAdditionalStatus({commit}) {
            commit('setMasArr', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getMkdAdditionalStatus', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setMasArr', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setMasArr', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setMasArr', {loading: false});
                });
        },
    },
    getters: {
        getWkArr(state) {
            return state.wk_arr;
        },
        getMkdTypeArr(state) {
            return state.mkd_type_arr;
        },
        getMasArr(state) {
            return state.mas_arr;
        },
    }
}