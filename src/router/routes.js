import VueRouter from "vue-router";
import AuthGuard from "@/router/auth-guard"

import Login from "@/pages/Auth/Login";
import Home from "@/pages/Employees/Home";
import NotFound from "@/pages/NotFound";
import Pfd from "@/pages/Employees/Pfd/Pfd";
import Ltp from "@/pages/Employees/Pfd/LongTermProgram/Ltp";
import LtpUpdateMetaModal from "@/pages/Employees/Pfd/LongTermProgram/LtpUpdateMetaModal";
import Ltpv from "@/pages/Employees/Pfd/LongTermProgram/Ltpv";

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
        },
        {
            path: '/pfd',
            component: Pfd,
            redirect: {path: '/pfd/ltp'},
            children: [
                {
                    path: 'ltp',
                    name: 'ltp',
                    component: Ltp,
                    meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                    children: [
                        {
                            path: 'updateMeta/:id',
                            name: 'updateMeta',
                            component: LtpUpdateMetaModal,
                            meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                        }
                    ]
                },
                {
                    path: 'ltp/v:id',
                    name: 'ltpv',
                    component: Ltpv,
                    meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                },
            ],
        },
        {
            path: '*',
            component: NotFound
        }
    ],
    mode: 'history'
});

router.beforeEach(AuthGuard);
