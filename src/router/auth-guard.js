import store from "../store";

export default (to, from, next) => {
    let user = store.getters.user;
    if (user) {
        if (to.meta.acs_name) {
            if (user.accesses.some(user_acs => {
                return to.meta.acs_name.some(acs => acs === user_acs.acs_name);
            })) {
                next();
            } else {
                next('/home');
            }
        } else
            next();
    } else {
        next('/login');
    }
}