import Vue from 'vue'
import Vuex from 'vuex'
import login from "./Auth/login";
import root from "./root"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        login, root
    }
});
