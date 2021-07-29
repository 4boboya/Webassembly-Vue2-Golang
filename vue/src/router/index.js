import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { login } from './classify/login.js';
import { main } from './classify/main.js';
import { account } from './classify/account.js';
import { Exceptions } from './classify/exception.js';
import { docs } from './classify/docs.js';
import { liveChat } from './classify/liveChat.js';
import Auth from '@/library/global/Auth';

Vue.use(VueRouter);
Vue.use(store);
const routes = [];
routes.push(liveChat, login, account, Exceptions, docs, main);

// redirect:
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    await Auth.AuthCheck();
    if (store.state.Login.Status && (to.path == '/login' || to.path == '/register')) {
        next('/');
        document.title = 'Home';
    } else if (!store.state.Login.Status && to.path.includes('/account')) {
        next('/login');
        document.title = 'Login';
    } else if (to.path == '/account') {
        next('/account/profile');
    } else {
        next();
        document.title = to.meta.title;
    }
});

export default router;
