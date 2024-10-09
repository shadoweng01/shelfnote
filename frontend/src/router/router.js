import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@pages/error/NotFound.vue';
import { jwtDecode } from 'jwt-decode';
import api from '@api/Api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '@constants/constants';

// Router
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/hello-world',
            name: 'hello-world',
            component: () => import('@pages/hello-world/HelloWorld.vue'),
            meta:{
                reqAuth: false
            },
        },
        {
            path: '/',
            name: 'home',
            component: () => import('@pages/home/Home.vue'),
            meta:{
                reqAuth: true
            },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@pages/about/About.vue'),
            meta:{
                reqAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@pages/login/Login.vue'),
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@pages/login/Login.vue'),
            beforeEnter: (to, from, next) => {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                next({ name: 'login' });
            },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@pages/register/Register.vue'),
        },
        {
            path: '/:catchAll(.*)',
            name: "page-not-found",
            component: NotFound,
        },
    ],
});

//Functions
const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
        const res = await api.post('/api/token/refresh/', { refresh: refreshToken});
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return true;
        }
    } catch (error) {
        console.error(error);
    }
    return false;
};

const isAuthenticated = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    const tokenExperiation = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExperiation < now) {
        return await refreshToken();
    }
    return true;
}

//Navigation Guards
router.beforeEach(async (to,from,next)=>{
    if (to.matched.some(record => record.meta.reqAuth)) {
        const authorized = await isAuthenticated();
        if (!authorized) {
            next({ path: '/login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router
