import store from "../store";
import Vue from "vue";

export default async (to, from, next) => {
    let isLogged = store.getters["login/getAccessToken"];

    // Если нет токена доступа, пробуем его восстановить
    if(!isLogged && Vue.cookie.get('refresh_token')) {
        try {
            await store.dispatch("login/requestRefreshToken");
            isLogged = store.getters["login/getAccessToken"];
        }catch (err) {
            // 'Не удалось обновить токен!';
        }
    }

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
            let accesses = store.getters["login/getAccesses"]
            // Предоставляем доступ к странице, если есть хотя бы одна роль из перечня
            if (accesses.some(user_acs => {
                return to.meta.acs_name.some(acs => acs === user_acs.acs_name);
            })) {
                next();
            } else {
                next(from);
            }
        } else
            next();
    } else {
        next('/login');
    }
}