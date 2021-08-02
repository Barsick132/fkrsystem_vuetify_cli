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
        /**
         * @param state - содержимое ошибки;
         * @param payload - содержимое ошибки, м.б. объектом, содержащим статус;
         * @param method_name - наименование метода из, которого вызывается функция.
         */
        setError(state, [payload, method_name = '']) {
            console.error('Method: ' + method_name + '\n\t', payload);
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
