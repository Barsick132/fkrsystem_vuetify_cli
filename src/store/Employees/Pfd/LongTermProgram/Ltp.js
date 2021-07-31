import Vue from 'vue'
import {router} from '@/router/routes'
import {downloadFile} from "@/store/_helpers/files_helpers";

export default {
    namespaced: true,
    state: () => ({
        meta: {
            dialog: false,
            loading: false,
            progress: 0
        },
        counter_mkd_arr: {
            dialog: false,
            data: [],
            loading: false,
            progress: 0
        },
        versions: [],
    }),
    mutations: {
        setMeta(state, {dialog = state.meta.dialog, loading = state.meta.loading, progress = state.meta.progress}) {
            if (dialog === false && state.meta.dialog) {
                setTimeout(() => router.push({ name: 'ltp' }), 250);
            }

            state.meta = {
                dialog,
                loading,
                progress,
            }
        },
        setVersions(state, payload) {
            state.versions = payload;
        },
        setCounterMkdArr(state, {
            dialog = state.counter_mkd_arr.dialog,
            data = state.counter_mkd_arr.data,
            loading = state.counter_mkd_arr.loading,
            progress = state.counter_mkd_arr.progress
        }) {
            if (dialog === false && state.counter_mkd_arr.dialog) {
                setTimeout(() => router.push({ name: 'ltp' }), 250);
            }

            state.counter_mkd_arr = {
                dialog,
                data,
                loading,
                progress,
            }
        }
    },
    actions: {
        requestDownloadFile({commit}, file) {
            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/get/' + file.file_id + '/ltp', {
                responseType: 'blob', // important
            })
                .then(res => {
                    downloadFile(res);
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
        },
        async requestDelFile(commit, del_file_arr) {
            let res_arr = [];
            for (let i = 0; i < del_file_arr.length; i++) {
                res_arr.push(await Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/del/' + del_file_arr[i] + '/ltp'));
            }
            return res_arr;
        },
        requestUpdateMeta({commit, dispatch}, {ltpv_id, ltpv_name, file_arr, del_file_arr}) {
            commit('setMeta', {loading: true});

            let formDate = new FormData();

            formDate.set('ltpv_id', ltpv_id);
            formDate.set('ltpv_name', ltpv_name);

            for (let i = 0; i < file_arr.length; i++)
                formDate.append('file_arr[]', file_arr[i]);

            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/upd-meta', formDate, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 50)

                    commit('setMeta', {progress: uploadProgress});
                },
                onDownloadProgress: ({loaded, total}) => {
                    const downloadProgress = Math.round(50 + loaded / total * 50)

                    commit('setMeta', {progress: downloadProgress});
                }
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK') {
                        return dispatch('requestDelFile', del_file_arr)
                    } else {
                        throw res;
                    }
                })
                .then(res_arr => {
                    const error_res = res_arr.find(res => !res.data.status || res.data.status !== "OK");

                    dispatch('requestGetVersions');

                    if (error_res)
                        throw error_res.data;
                    else
                        commit('setMeta', {dialog: false})
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setMeta', {loading: false});
                })
        },
        requestGetVersions({commit}) {
            commit('setLoading', true, {root: true})
            commit('setProgress', 0, {root: true})

            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/getVersion', null, {
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
                        commit('setVersions', res.payload);
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
        requestGetCounterMkdByFlag({commit}, body) {
            /**
             * body = {
             * ltpv_id: 1, // required, numeric
             * flag: 'ADD' // required, string (values: ADD, EXC)
             * }
             */
            commit('setCounterMkdArr', {data: [], loading: true, progress: 0});

            Vue.axios.post(process.env.VUE_APP_SERVER_URL + 'api/pfd/long/counter', body, {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 100)

                    commit('setCounterMkdArr', {progress: uploadProgress})
                },
            })
                .then(res => {
                    res = res.data;

                    if (res.status && res.status === 'OK' && res.payload)
                        commit('setCounterMkdArr', {data: res.payload});
                    else
                        throw res;
                })
                .catch(err => {
                    commit('setError', err, {root: true});
                })
                .finally(() => {
                    commit('setCounterMkdArr', {loading: false});
                });
        }
    },
    getters: {
        getMeta(state) {
            return state.meta;
        },
        getVersions(state) {
            return state.versions;
        },
        getCounterMkdArr(state) {
            return state.counter_mkd_arr;
        }
    },
}