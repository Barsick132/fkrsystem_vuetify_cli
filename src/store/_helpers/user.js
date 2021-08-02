import Vue from 'vue'

export class User {
    static accessToken = {
        get() {
            return localStorage.getItem('accessToken');
        },
        set(access_token) {
            return localStorage.setItem('accessToken', access_token);
        },
        remove() {
            return localStorage.removeItem('accessToken');
        }
    }
    static tokenType = {
        get() {
            return localStorage.getItem('tokenType');
        },
        set(token_type) {
            return localStorage.setItem('tokenType', token_type);
        },
        remove() {
            return localStorage.removeItem('tokenType');
        }
    }
    static refreshToken = {
        get() {
            return localStorage.getItem('refreshToken');
        },
        set(refresh_token) {
            return localStorage.setItem('refreshToken', refresh_token);
        },
        remove() {
            return localStorage.removeItem('refreshToken');
        }
    }
    static expiresIn = {
        get() {
            return JSON.parse(localStorage.getItem('expiresIn'));
        },
        set(expires_in) {
            return localStorage.setItem('expiresIn', JSON.stringify(new Date(new Date().getTime() + expires_in * 1000)));
        },
        remove() {
            return localStorage.removeItem('expiresIn');
        }
    }

    static saveAuthData({access_token, token_type, expires_in, refresh_token, remember_me = null}) {
        this.accessToken.set(access_token);
        this.tokenType.set(token_type);
        this.expiresIn.set(expires_in);
        if (remember_me === true || (remember_me === null && this.refreshToken.get()))
            this.refreshToken.set(refresh_token);
    }

    static removeAuthData() {
        this.accessToken.remove();
        this.tokenType.remove();
        this.refreshToken.remove();
        this.expiresIn.remove();
    }
}

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
                    commit('setError', [err, 'user.js requestGetUser()'], {root: true})
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