import VueRouter from "vue-router";
import AuthGuard from "@/router/auth-guard"

import Login from "@/pages/Auth/Login";
import Home from "@/pages/Employees/Home";
import NotFound from "@/pages/NotFound";

const Pfd = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/Pfd");
const Ltp = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/Ltp");
const LtpUpdateMetaModal = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/LtpUpdateMetaModal");
const LtpCounterMkdModal = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/LtpCounterMkdModal");
const Ltpv = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/Ltpv");
const Mkd = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/Mkd/Mkd.vue");
const MkdParams = () => import(/* webpackChunkName: "group-pfd" */ "@/pages/Employees/Pfd/LongTermProgram/Mkd/MkdParams.vue");



export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: {name: 'home'}
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
        },
        {
            path: '/pfd',
            name: 'pfd',
            component: Pfd,
            redirect: {name: 'ltp'},
            children: [
                {
                    path: 'ltp',
                    name: 'ltp',
                    component: Ltp,
                    meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                    children: [
                        {
                            path: 'updateMeta/ltpv_id:ltpv_id',
                            name: 'updateMeta',
                            component: LtpUpdateMetaModal,
                            meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                        },
                        {
                            path: 'counterMkd/ltpv_id:ltpv_id/:flag',
                            name: 'counterMkd',
                            component: LtpCounterMkdModal,
                            meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                        }
                    ]
                },
                {
                    path: 'ltp/ltpv_id:ltpv_id',
                    name: 'ltpv',
                    component: Ltpv,
                    meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                },
                {
                    path: 'mkd/ltpv_id:ltpv_id/mkdstate_id:mkdstate_id',
                    name: 'mkd',
                    component: Mkd,
                    redirect: {name: 'mkdParams'},
                    children: [
                        {
                            path: 'mkdParams',
                            name: 'mkdParams',
                            component: MkdParams,
                            meta: {acs_name: ['admin', 'frp', 'spec_frp']},
                        }
                    ]
                }
            ],
        },
        {
            path: '*',
            name: 'notFound',
            component: NotFound
        }
    ],
    mode: 'history'
});

router.beforeEach(AuthGuard);
