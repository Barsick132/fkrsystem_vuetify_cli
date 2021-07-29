export default {
    namespaced: true,
    state: () => ({
        drawer: false,
        menu: {
            name: 'Меню',
            items: [
                {
                    name: 'ltp',
                    label: 'Долгосрочная программа',
                    to: {name: 'ltp'}
                },
                {
                    name: 'stp',
                    label: 'Краткосрочная программа',
                    to: '/pfd/stp'
                },
                {
                    name: 'settings',
                    label: 'Настройки',
                    to: '/pfd/settings'
                },
                {
                    name: 'reports',
                    label: 'Отчеты',
                    to: '/pfd/reports'
                }
            ]
        },
        sub_drawer: true,
        sub_menu: null
    }),
    mutations: {
        setDrawer(state, payload) {
            state.drawer = payload;
        },
        setSubDrawer(state, payload) {
            state.sub_drawer = payload;
        },
        setSubMenu(state, payload) {
            state.sub_menu = payload;
        },
    },
    actions: {},
    getters: {
        getDrawer(state) {
            return state.drawer;
        },
        getMenu(state) {
            return state.menu;
        },
        getSubDrawer(state) {
            return state.sub_drawer;
        },
        getSubMenu(state) {
            return state.sub_menu;
        }
    },
}