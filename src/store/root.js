export default {
    state: () => ({
        loading: false,
        progress: 0,
        notifications: [],
    }),
    mutations: {
        setProgress(state, payload) {
            state.progress = payload;
        },
        setLoading(state, payload) {
            state.loading = payload;
        },
        setError(state, payload) {
            console.error(payload);
            if (payload.status && window.ErrorsMes[payload.status])
                this.commit('setNotification', {value: window.ErrorsMes[payload.status], color: 'error'}, {root: true});
            else
                this.commit('setNotification', {value: window.ErrorsMes.UNKNOWN_ERROR, color: 'error'}, {root: true});
        },
        setNotification(state, payload) {
            state.notifications.unshift({time: new Date().getTime(), ...payload});
        },
        clearNotification(state, time) {
            var key = state.notifications.findIndex(item => item.time === time);
            state.notifications.splice(key, 1);
        }
    },
    actions: {},
    getters: {
        progress(state) {
            return state.progress;
        },
        loading(state) {
            return state.loading;
        },
        notifications(state) {
            return state.notifications;
        }
    }
}
