import VueRouter from "vue-router";
import Login from "../pages/Auth/Login";
import Home from "../pages/Employees/Home";
import NotFound from "../pages/NotFound";
import AuthGuard from "../router/auth-guard"

export default new VueRouter({
    routes: [
        {
          path: '/',
          redirect: '/home'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/home',
            component: Home,
            beforeEnter: AuthGuard
        },
        {
            path: '*',
            component: NotFound
        }
    ],
    mode: 'history'
});
