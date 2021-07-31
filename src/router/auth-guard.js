import store from "@/store";
import {User} from "@/store/_helpers/user"

export default async (to, from, next) => {
    let isLogged = User.accessToken.get();

    // Если пользователь авторизован, не пускаем его на страницу авторизации
    if (to.fullPath === '/login') {
        if (isLogged)
            next(from);
        else
            next();
    }

    if (isLogged) {
        // Если для доступа к странице требуются отдельные роли,
        // проверяем их наличие у пользователя
        if (to.meta.acs_name) {
            // Запрашиваем данные пользователя и проверяем доступ
            let accesses = store.getters["auth/getAccesses"];

            if(accesses === null) {
                // Запрашиваем доступы, так как ранее они не запрашивались
                await store.dispatch('auth/requestGetAccesses');
                accesses = store.getters["auth/getAccesses"];
            }

            // Предоставляем доступ к странице, если есть хотя бы одна роль из перечня
            if (accesses.some(user_acs => {
                return to.meta.acs_name.some(acs => acs === user_acs.acs_name);
            })) {
                next();
            } else {
                store.commit('setError', {status: 'NOT_ACCESS'}, {root: true})
                next(from);
            }
        } else
            next();
    } else {
        next('/login');
    }
}