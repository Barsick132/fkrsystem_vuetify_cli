import VueRouter from "vue-router";
import Login from "./pages/Auth/Login";
import Home from "./pages/Employees/Home";

export default new VueRouter({
    routes: [
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/home',
            component: Home,
        },
    ],
    mode: 'history'
});
