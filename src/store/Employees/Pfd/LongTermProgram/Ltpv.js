import Vue from "vue";

export default {
    namespaced: true,
    state: () => ({
        mkds: null,
        stp_arr: {
            data: [],
            loading: false,
            progress: 0
        },
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
        },
        setStpArr(state, {
            data = state.stp_arr.data,
            loading = state.stp_arr.loading,
            progress = state.stp_arr.progress
        }) {
            data = data.map(stp => {
                if (stp.stp_year_start && stp.stp_year_end)
                    return {stp_id: stp.stp_id, stp_period: stp.stp_year_start + ' - ' + stp.stp_year_end};
                else
                    return stp;
            })

            state.stp_arr = {data, loading, progress}
        },
    },
    actions: {
        requestGetMkdInLtpV({commit}, body) {
            commit('setLoading', true, {root: true})
            commit('setProgress', 0, {root: true})
            commit('setMkds', null);

            console.log('ltpv_id: ', body.ltpv_id);
            console.log('step: ', body.step);
            console.log('offset: ', body.offset);
            console.log('filters: ', body.filters);
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
        },
        requestGetStpByLtpvId({commit}, ltpv_id) {
            commit('setStpArr', {loading: true, progress: 0});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/getStp/' + ltpv_id, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setStpArr', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setStpArr', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setStpArr', {loading: false});
                });
        }
    },
    getters: {
        getMkds(state) {
            console.log(state.mkds);
            return state.mkds;
        },
        getStpArr(state) {
            return state.stp_arr;
        },
    }
}