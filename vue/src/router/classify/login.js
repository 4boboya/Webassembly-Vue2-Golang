import LoginTemplate from '@/views/Login.vue'

export const login = {
    path: '/login',
    component: LoginTemplate,
    children: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/login/Login.vue'),
            meta: {
                title: 'Login'
            },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/login/Register.vue'),
            meta: {
                title: 'Register'
            },
        },
        {
            path: '/requestPassword',
            name: 'requestPassword',
            component: () => import('@/views/login/RequestPWD.vue'),
            meta: {
                title: 'RequestPassword'
            },
        },
        {
            path: '/validate/forgetPassword',
            name: 'forgetPassword',
            component: () => import('@/views/login/ForgetPWD.vue'),
            meta: {
                title: 'ForgetPassword'
            },
        },
        {
            path: '/validate/member',
            name: 'validate',
            component: () => import('@/views/login/Validate.vue'),
            meta: {
                title: 'Validate'
            },
        },
    ]
};
