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
        homes: {
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
        setHomes(state, {
            data = state.homes.data,
            loading = state.homes.loading,
            progress = state.homes.progress
        }) {
            state.homes = {data, loading, progress}
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
                    commit('setError', [err, 'address.js requestGetMunicipalities()'], {root: true});
                })
                .finally(() => {
                    commit('setMunicipalities', {loading: false});
                });
        },
        requestGetAllSettlementsWithFull({commit}) {
            commit('setSettlements', {data: [], loading: true, progress: 0});
            commit('setStreets', {data: []});
            commit('setHomes', {data: []});

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
                    commit('setError', [err, 'address.js requestGetAllSettlementsWithFull()'], {root: true});
                })
                .finally(() => {
                    commit('setSettlements', {loading: false});
                });
        },
        requestGetStreets({commit}, settlement_id) {
            commit('setStreets', {data: [], loading: true, progress: 0});
            commit('setHomes', {data: []});

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
                    commit('setError', [err, 'address.js requestGetStreets()'], {root: true});
                })
                .finally(() => {
                    commit('setStreets', {loading: false});
                });
        },
        requestGetHomesById({commit}, {settlement_id, street_id}) {
            commit('setHomes', {data: [], loading: true, progress: 0})

            var body = null;
            if (street_id)
                body = {street_id};
            else if (settlement_id)
                body = {settlement_id};

            Vue.axios.post('/api/global/getMkdHomeArrByStreetId', body, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setHomes', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;
                    if (res.status && res.status === 'OK' && res.payload) {
                        commit('setHomes', {data: res.payload})
                    } else
                        throw res;
                })
                .catch(err => {
                    commit('setError', [err, 'address.js requestGetHomesById()'], {root: true})
                })
                .finally(() => {
                    commit('setHomes', {loading: false})
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
        },
        getHomes(state) {
            return state.homes;
        }
    }
}