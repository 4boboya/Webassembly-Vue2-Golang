import MemberTemplate from '@/views/Member.vue';

export const account = {
    path: '/account',
    component: MemberTemplate,
    children: [
        {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/member/Profile.vue'),
            meta: {
                title: 'Profile'
            }
        },
        {
            path: 'order',
            name: 'order',
            component: () => import('@/views/member/Order.vue'),
            meta: {
                title: 'Order'
            }
        },
    ]
};
