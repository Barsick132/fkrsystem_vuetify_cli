import Vue from "vue";

export default {
    namespaced: true,
    state: () => ({
        municipalities: {
            data: [],
            loading: false,
            progress: 0
        },
        settlements: {
            data: [],
            loading: false,
            progress: 0
        },
        streets: {
            data: [],
            loading: false,
            progress: 0
        },
    }),
    mutations: {
        setMunicipalities(state, {
            data = state.municipalities.data,
            loading = state.municipalities.loading,
            progress = state.municipalities.progress
        }) {
            state.municipalities = {data, loading, progress}
        },
        setSettlements(state, {
            data = state.settlements.data,
            loading = state.settlements.loading,
            progress = state.settlements.progress
        }) {
            state.settlements = {data, loading, progress}
        },
        setStreets(state, {
            data = state.streets.data,
            loading = state.streets.loading,
            progress = state.streets.progress
        }) {
            state.streets = {data, loading, progress}
        },
    },
    actions: {
        requestGetMunicipalities({commit}) {
            commit('setMunicipalities', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getMunicipalities', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setMunicipalities', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setMunicipalities', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setMunicipalities', {loading: false});
                });
        },
        requestGetAllSettlementsWithFull({commit}) {
            commit('setSettlements', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/global/getAllSettlementsWithFull', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setSettlements', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setSettlements', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setSettlements', {loading: false});
                });
        },
        requestGetStreets({commit}, settlement_id) {
            commit('setStreets', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/global/getStreets/' + settlement_id, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setStreets', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setStreets', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setStreets', {loading: false});
                });
        },
    },
    getters: {
        getMunicipalities(state) {
            return state.municipalities;
        },
        getSettlements(state) {
            return state.settlements;
        },
        getStreets(state) {
            return state.streets;
        }
    }
}