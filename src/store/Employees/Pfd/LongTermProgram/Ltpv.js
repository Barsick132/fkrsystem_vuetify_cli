import Vue from "vue";
import {downloadFile} from "@/store/_helpers/files_helpers";

export default {
    namespaced: true,
    state: () => ({
        mkds: null,
        stp_arr: {
            data: [],
            loading: false,
            progress: 0
        }
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
        }
    },
    actions: {
        requestGetMkdInLtpV({commit}, body) {
            commit('setLoading', true, {root: true})
            commit('setProgress', 0, {root: true})
            commit('setMkds', null);

            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/getMkdInLtpV', body, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setProgress', uploadProgress, {root: true})
                },
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
                    commit('setError', [err, 'Ltpv.js requestGetMkdInLtpV()'], {root: true})
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
                    commit('setError', [err, 'Ltpv.js requestGetStpByLtpvId()'], {root: true});
                })
                .finally(() => {
                    commit('setStpArr', {loading: false});
                });
        },
        requestExportDp({commit}, ltpv_id) {
            commit('setNotification', {value: 'Скачивание началось', color: 'info'}, {root: true});

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/export/' + ltpv_id, {
                responseType: 'blob'
            })
                .then(res => {
                    downloadFile(res);
                })
                .catch(err => {
                    commit('setError', [err, 'Ltpv.js requestExportDp()'], {root: true});
                });
        }
    },
    getters: {
        getMkds(state) {
            return state.mkds;
        },
        getStpArr(state) {
            return state.stp_arr;
        },
    }
}