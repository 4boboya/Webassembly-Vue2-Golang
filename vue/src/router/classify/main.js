import HomeTemplate from '@/views/Home.vue'

export const main = {
    path: '',
    component: HomeTemplate,
    children: [
        { path: '/', redirect: '/live' },
        {
            path: '/:tabpage(live|analysis|forums|results)',
            name: 'main',
            meta: {
                title: 'Home'
            },
            component: () => import('@/views/home/Main.vue'),
        },
        {
            path: '*',
            redirect: '/error',
        }
    ]
};
