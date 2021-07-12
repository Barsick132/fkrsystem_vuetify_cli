import Vue from 'vue'
import Vuex from 'vuex'
import Ltp from "./Employees/LongTermProgram/Ltp";
import login from "./Auth/login";
import user from "./_helpers/user";
import root from "./root"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Ltp, login, user, root
    }
});
