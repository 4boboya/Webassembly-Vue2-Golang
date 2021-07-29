import LiveTemplate from '@/views/LiveChat.vue'

export const liveChat = {
    path: '/liveChat',
    component: LiveTemplate,
    children: [
        {
            path: `/liveChat/:gametype/:id`,
            name: 'liveChat',
            meta: {
                title: 'LiveChat'
            },
            component: () => import('@/views/liveChat/LiveChat.vue'),
        },
    ]
};
