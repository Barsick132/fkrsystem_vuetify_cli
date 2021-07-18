import Vue from 'vue'
import Vuex from 'vuex'
import Ltp from "./Employees/Pfd/LongTermProgram/Ltp";
import Ltpv from "./Employees/Pfd/LongTermProgram/Ltpv";
import login from "./Auth/login";
import user from "./_helpers/user";
import address from "./_helpers/address";
import catalogs from "./_helpers/catalogs";
import root from "./root"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Ltp, Ltpv, login,
        user, address, catalogs,
        root
    }
});
