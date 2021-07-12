import Vue from 'vue'

export default {
    namespaced: true,
    state: () => ({
        user_loading: false,
        user_progress: 0,
        user: null
    }),
    mutations: {
        setUserLoading(state, payload) {
            state.user_loading = payload;
        },
        setUserProgress(state, payload) {
            state.user_progress = payload;
        },
        setUser(state, res) {
            if (res.status === "OK" && res.payload) {
                state.user = res.payload;
            } else {
                throw res;
            }
        }
    },
    actions: {
        requestGetUser({commit}) {
            commit('setUserLoading', true);

            Vue.axios.get(process.env.VUE_APP_SERVER_URL + 'api/getUser', {
                onUploadProgress: ({loaded, total}) => {
                    const uploadProgress = Math.round(loaded / total * 50)

                    commit('setUserProgress', uploadProgress)
                },
                onDownloadProgress: ({loaded, total}) => {
                    const downloadProgress = Math.round(50 + loaded / total * 50)

                    commit('setUserProgress', downloadProgress)
                },
            })
                .then(res => {
                    commit('setUser', res.data);
                })
                .catch(err => {
                    commit('setError', err, {root: true})
                })
                .finally(() => {
                    commit('setUserLoading', false);
                })
        }
    },
    getters: {
        getUserLoading(state) {
            return state.user_loading;
        },
        getUserProgress(state) {
            return state.user_progress;
        },
        getUser(state) {
            return state.user;
        },
    }
}